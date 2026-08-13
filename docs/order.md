# HealthyHub Order / Đơn hàng HealthyHub

## Status

**Prompt 28 Customer Orders V1 — implemented on persisted Order data.**

Public boundary: `POST /api/v1/orders`, protected by Customer JWT and verified-email policy. `X-Idempotency-Key` is required.

The server resolves the Customer and active Cart, revalidates Product price/sellability and Inventory availability, recomputes the manual Shipping quote, accepts backend-approved payment methods, calculates VND totals, then atomically persists immutable Order snapshots. Retry with the same key and payload returns the existing Order; conflicting reuse is rejected.

COD starts as `pending` and does not call a provider. VNPAY starts as `pending` and only the verified Payment/IPN/query flow may apply the approved Order confirmation effect.

This boundary does not implement payment capture outside VNPAY redirect/IPN, shipment fulfillment, inventory reservation/mutation, cancellation or admin Order operations. Cart remains active until a later approved lifecycle decision.

MySQL verification đã kiểm tra toàn aggregate VNPAY: Order/OrderItem/Payment/PaymentAttempt/Shipment/address snapshot được giữ nguyên qua browser return; chỉ valid IPN chuyển Payment và Order payment snapshot sang `paid`, đồng thời chỉ chuyển Order `new → confirmed`. Duplicate IPN không double effect. COD regression vẫn `pending/new`, không tạo provider attempt.

## Customer Read API / API đọc cho Customer

- `GET /api/v1/me/orders`: owner-scoped, phân trang mặc định 20/tối đa 100, lọc theo Order/Payment/Shipping status và khoảng ngày đã whitelist, sort `placedAt DESC, id DESC`.
- `GET /api/v1/me/orders/{orderId}`: trả persisted OrderItem, totals, Shipment/address snapshot và Payment summary an toàn. Không trả signature, hash secret, raw provider event hoặc internal audit metadata.
- Customer owner luôn được resolve từ JWT → CustomerProfile ở server; request không nhận `customerId`. Guest bị AccessToken guard chặn, internal account bị Customer role/owner policy chặn, đơn không thuộc owner trả cùng `404 ORDER.NOT_FOUND`.

Frontend `/orders` và `/orders/:orderId` tải lại hoàn toàn từ hai API trên, nên direct URL/reload không phụ thuộc React memory. COD/VNPAY hiển thị canonical `payments.payment_status`; browser return không tham gia suy luận trạng thái.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
