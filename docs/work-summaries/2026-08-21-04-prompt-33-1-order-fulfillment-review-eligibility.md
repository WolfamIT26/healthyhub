# Prompt 33.1 - Order Fulfillment & Review Eligibility Contract

## Task / Nhiệm vụ

Chốt và triển khai canonical Order/Shipment fulfillment lifecycle thật để mở khóa Review eligibility, giữ Payment/Inventory authority đúng transaction và không triển khai Review persistence/API/UI.

## Result / Kết quả

| Boundary / Ranh giới | Result / Kết quả |
| --- | --- |
| Order Fulfillment Lifecycle | **READY** |
| COD Fulfillment | **READY** |
| VNPAY Fulfillment | **READY** |
| Delivered/Completed Evidence | **READY** |
| Cancellation/Return Eligibility Effect | **READY** |
| Review Eligibility Contract | **READY** |
| Review Duplicate Identity | **READY — Order + Product** |
| Regression | **PASS** |

## Canonical Lifecycle / Lifecycle chuẩn

Order và Shipment giữ hai state machine riêng:

- Order: `new → confirmed|completed|cancelled`; `confirmed → completed|cancelled`; `completed → returned`.
- Shipment: `pending → shipped|cancelled`; `shipped → delivered`; `delivered → returned`.
- Không thêm `processing`, `preparing`, `failed` hoặc trạng thái provider dư.

| Transition / Chuyển trạng thái | Authority / Thẩm quyền |
| --- | --- |
| OrderPlaced | Order creation tạo Order `new`, Shipment `pending`. |
| VNPAY `new → confirmed` | Chỉ verified Payment IPN/query business transaction; browser return read-only. |
| `pending → shipped` | Internal Fulfillment service. COD cho phép khi Payment pending; VNPAY yêu cầu paid + confirmed. |
| `shipped → delivered` + Order `new|confirmed → completed` | Internal Fulfillment service atomically set `shippedAt`, `deliveredAt`, `completedAt`. |
| Cancel trước shipment | Internal Order service: Shipment/Order cancelled và Inventory restore trong cùng transaction. |
| Full return sau delivery | Internal Fulfillment service: Shipment/Order returned và Inventory restock trong cùng transaction. |

Payment `paid` không đồng nghĩa delivered. VNPAY paid Order bị cancelled/returned không được late event revive hoặc reacquire stock; event fail để reconciliation. Provider refund execution không được mở trong prompt này.

## Review Eligibility / Điều kiện Review

Customer chỉ đủ điều kiện khi server resolve đúng CustomerProfile từ JWT, Order thuộc Customer, active Order Item chứa Product, Order là `completed`, Shipment là `delivered` và cả `completedAt`/`deliveredAt` tồn tại. Cancelled/returned fulfillment revoke eligibility.

Canonical duplicate identity là `(order_id, product_id)`: một review cho mỗi Product trong mỗi fulfilled purchase occasion; các line trùng Product trong cùng Order không tạo nhiều identity. Future Review V1 mặc định `published`; owner edit giữ published in-place; owner delete soft-delete. Full return giữ content đã tồn tại nhưng revoke verified-purchase evidence/badge. Payment refund riêng không tự quyết định fulfillment eligibility.

## Persistence & Transaction / Persistence và transaction

- Migration `1760000014000-enable-order-fulfillment-review-eligibility` mở exact Order/Shipment status checks và tạo `order_status_histories`, `shipping_status_histories` với FK/index/check/audit fields.
- Reuse `orders.completed_at`, `shipments.shipped_at`, `shipments.delivered_at`; không tạo field trùng.
- Order/Shipment rows được pessimistic-write lock theo thứ tự ổn định. Desired state đã đạt là idempotent; invalid/skipped/regressive/chronology-invalid transition fail closed.
- Status/timestamps/history và Inventory release/restock commit hoặc rollback cùng nhau. Failure-injection tại history FK chứng minh stock và Order/Shipment đều rollback.
- Không tạo Review table/migration. `ReviewEligibilityService` là internal read/policy foundation; future create phải recheck trong transaction trước insert.

## Testing / Kiểm thử

- Valid/invalid/duplicate/concurrent COD fulfillment và persisted delivery/completion evidence.
- VNPAY bị chặn trước verified paid; paid vẫn chưa eligible cho tới delivery.
- Cancel active VNPAY reservation, restock consumed COD, full return restock và retry idempotent.
- Transaction rollback sau stock restore, timestamp chronology và durable history count.
- Review owner/Product evidence; Customer A không dùng Order Customer B; Product ngoài Order bị từ chối; return revoke.
- Duplicate VNPAY IPN không double stock hoặc Order history; late paid không revive cancelled/returned.
- Customer Order frontend labels/types cho toàn bộ canonical state; Product/Cart/Checkout/Order/Payment regressions giữ nguyên.

## Verification / Kiểm tra

- Format check: **PASS**.
- Lint: **PASS**.
- Typecheck: **PASS**.
- Unit tests: **PASS — API 202 + Web 133 = 335 tests**.
- MySQL integration: **PASS — 11 files / 18 tests**, chạy sequential với toàn bộ opt-in flags.
- Migration state: **PASS — 15/15 applied**.
- Build: **PASS**.
- OpenAPI: **PASS — 196 operations / 196 unique IDs / 196 spec rows**.
- Secrets/docs/diff checks: **PASS**.

## Not Changed / Không thay đổi

- Không Review persistence/entity/controller/API/rating aggregate/Product Detail integration/form/list UI.
- Không full Admin Order/Shipping UI/API hoặc Customer self-cancellation endpoint.
- Không payment-provider refund/settlement, partial return, split shipment, shipping provider/tracking/delivery attempts.
- Không Admin Inventory UI/API, warehouse, supplier, purchase order hoặc adjustment.
- Không dùng browser return/frontend làm Payment, Order hoặc Shipment authority.
- Không commit, push, merge hoặc bắt đầu Prompt 33.2.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`

