# Inventory Decision / Quyết định Inventory

## Decision Log / Nhật ký quyết định

| Date | Decision / Quyết định | Reason / Lý do |
| --- | --- | --- |
| 2026-08-21 | `inventory_items` + `InventoryAvailabilityReader` là authority duy nhất | Tránh authority song song và giữ Product/Cart contract hiện tại. |
| 2026-08-21 | Không thêm migration Prompt 32 | FK, unique và non-negative constraints đã tồn tại; không có executable mutation cần schema mới. |
| 2026-08-21 | Zero quantity luôn là out-of-stock | Quantity là dữ liệu quyết định; status lưu không được làm zero stock thành sellable. |
| 2026-08-21 | Không mutate stock tại Order/VNPAY/COD | Thiếu canonical reserve/deduct/release/cancel lifecycle và COD confirmation point. |
| 2026-08-21 | Reserve trong transaction tạo Order cho cả COD/VNPAY | Giảm sellable quantity trước commit và dùng pessimistic row lock để chống oversell. |
| 2026-08-21 | COD consume ngay tại OrderPlaced | COD không có confirmation transition executable; Order được chấp nhận là business commitment. |
| 2026-08-21 | VNPAY chỉ consume/release từ verified IPN | Browser return không phải payment authority; paid consume, failed/cancelled release. |
| 2026-08-21 | VNPAY pending không có Inventory TTL độc lập | Payment chưa có authoritative timeout transition/scheduler; Inventory không tự phát minh payment failure theo đồng hồ. |
| 2026-08-21 | Unique `(tenant_id, order_id, inventory_item_id)` là stock idempotency identity | Một Order chỉ tạo một reservation effect cho mỗi Inventory item; state transition và Payment event dedupe bảo vệ retry/concurrent duplicate. |
| 2026-08-21 | Late paid sau failed phải reacquire atomically | Payment policy cho `failed → paid`; chỉ confirm nếu còn stock, nếu không transaction fail để reconciliation và không oversell. |

## Cancellation / Refund Boundary / Ranh giới hủy và hoàn tiền

Order cancellation/refund API và status transition chưa executable. Vì vậy Prompt 32.1 không tạo trigger giả: future cancellation của active reservation phải `release`; cancellation/refund đã consumed chỉ được `restock` trong cùng authoritative Order/refund transaction. `restock` hiện là internal idempotent primitive.
