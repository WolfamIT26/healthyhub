# HealthyHub Order / Đơn hàng HealthyHub

## Status

**Prompt 28 Customer Orders V1 — implemented on persisted Order data.**

Public boundary: `POST /api/v1/orders`, protected by Customer JWT and verified-email policy. `X-Idempotency-Key` is required.

The server resolves the Customer and active Cart, revalidates Product price/sellability and Inventory availability, recomputes the manual Shipping quote, accepts backend-approved payment methods, calculates VND totals, then atomically reserves stock and persists immutable Order snapshots. Retry with the same key and payload returns the existing Order; conflicting reuse is rejected.

COD starts as `pending`, does not call a provider and consumes its reservation immediately at OrderPlaced because no later COD confirmation transition exists. VNPAY starts as `pending`; its reservation stays active and only verified Payment/IPN/query authority may consume or release it.

This boundary does not implement payment capture outside VNPAY redirect/IPN, shipment fulfillment, cancellation/refund or admin Order operations. Cart remains active until a later approved lifecycle decision.

Prompt 32.1 mở Order Stock Integration: reserve và Order aggregate dùng cùng transaction; Inventory rows được lock theo thứ tự ổn định. Concurrent Orders không thể cùng tiêu thụ một quantity, và failure sau reserve rollback cả Order lẫn stock.

MySQL verification kiểm tra toàn aggregate VNPAY: Order/OrderItem/Payment/PaymentAttempt/Shipment/address snapshot và stock reservation được giữ qua browser return; chỉ valid IPN chuyển Payment/Order và consume stock. Duplicate IPN không double effect. COD vẫn `pending/new`, không tạo provider attempt nhưng stock đã committed tại OrderPlaced.

## Customer Read API / API đọc cho Customer

- `GET /api/v1/me/orders`: owner-scoped, phân trang mặc định 20/tối đa 100, lọc theo Order/Payment/Shipping status và khoảng ngày đã whitelist, sort `placedAt DESC, id DESC`.
- `GET /api/v1/me/orders/{orderId}`: trả persisted OrderItem, totals, Shipment/address snapshot và Payment summary an toàn. Không trả signature, hash secret, raw provider event hoặc internal audit metadata.
- Customer owner luôn được resolve từ JWT → CustomerProfile ở server; request không nhận `customerId`. Guest bị AccessToken guard chặn, internal account bị Customer role/owner policy chặn, đơn không thuộc owner trả cùng `404 ORDER.NOT_FOUND`.

Frontend `/orders` và `/orders/:orderId` tải lại hoàn toàn từ hai API trên, nên direct URL/reload không phụ thuộc React memory. COD/VNPAY hiển thị canonical `payments.payment_status`; browser return không tham gia suy luận trạng thái.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
