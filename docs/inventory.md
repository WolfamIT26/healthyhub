# HealthyHub Inventory V1 / Tồn kho HealthyHub V1

## Authority / Nguồn thẩm quyền

`inventory_items` là persistence authority cho quantity và stock status. `InventoryAvailabilityReader` chuẩn hóa requested quantity thành available, low-stock, insufficient, out-of-stock, unavailable hoặc invalid. Missing/deleted/disabled row không có fallback giả; zero quantity luôn out-of-stock.

Product public API chỉ trả `availability` và `sellable`, không expose quantity. Cart add/update và Order create đều đọc Product/Inventory phía server; dữ liệu stock từ browser không được tin cậy.

## Persistence & Idempotency / Dữ liệu và idempotency

Một active Inventory row cho mỗi tenant/Product được bảo vệ bằng unique constraint; Product reference có FK `RESTRICT`; quantity là unsigned và có check constraint không âm.

Prompt 32.1 thêm `stock_reservations` cho Order lifecycle. Unique `(tenant_id, order_id, inventory_item_id)` là canonical stock business identity; cùng Order/Product effect chỉ ghi một lần. Reservation có FK `RESTRICT` tới Inventory/Order và state `active`, `consumed`, `released`, `restocked`.

## Canonical Lifecycle / Lifecycle chuẩn

| Event / Sự kiện | Stock effect / Tác động |
| --- | --- |
| OrderPlaced — COD | Reserve trong Order transaction rồi consume ngay; `available` giảm một lần, `reserved` trở về 0. |
| OrderPlaced — VNPAY | Reserve trong Order transaction; reservation giữ `active` khi Payment pending. |
| Browser return | Không có stock effect. |
| Verified VNPAY paid IPN | Consume active reservation trong provider-event transaction. |
| Verified VNPAY failed/cancelled IPN | Release active reservation, trả quantity về available. |
| Late paid sau failed | Reacquire available stock bằng row lock rồi consume; nếu không đủ, rollback Payment/Order/event effect để reconciliation. |
| Authoritative cancel trước consume | Future Order cancellation transaction gọi release. Runtime cancellation hiện chưa có. |
| Authoritative cancel/refund sau consume | Future Order/refund transaction gọi idempotent restock. Runtime cancellation/refund hiện chưa có. |

VNPAY pending không dùng browser return, Payment attempt URL expiry hoặc Inventory clock độc lập để release. Hiện chưa có authoritative Payment timeout transition/scheduler, nên reservation chỉ release từ terminal provider event. Đây là quyết định fail-closed, không phải TTL ngầm.

## Transaction & Concurrency / Transaction và đồng thời

Order transaction sở hữu reserve + COD consume + aggregate persistence. Verified IPN transaction sở hữu reservation transition + Payment/Order transition + provider event processed marker. Pessimistic Inventory row lock theo thứ tự Product ổn định ngăn concurrent Orders oversell; unsigned/check constraints và runtime invariant giữ stock không âm.

Admin Inventory UI/API, manual adjustment, warehouse, supplier, purchase order, stock transfer, batch/lot, expiry, analytics và low-stock notification không thuộc Prompt 32.1.
