# HealthyHub Order Creation Boundary

## Status

**Prompt 27.3 Automated Verification PASS — Order mapping verified.**

Public boundary: `POST /api/v1/orders`, protected by Customer JWT and verified-email policy. `X-Idempotency-Key` is required.

The server resolves the Customer and active Cart, revalidates Product price/sellability and Inventory availability, recomputes the manual Shipping quote, accepts backend-approved payment methods, calculates VND totals, then atomically persists immutable Order snapshots. Retry with the same key and payload returns the existing Order; conflicting reuse is rejected.

COD starts as `pending` and does not call a provider. VNPAY starts as `pending` and only the verified Payment/IPN/query flow may apply the approved Order confirmation effect.

This boundary does not implement payment capture outside VNPAY redirect/IPN, shipment fulfillment, inventory reservation/mutation, cancellation or admin Order operations. Cart remains active until a later approved lifecycle decision.

MySQL verification đã kiểm tra toàn aggregate VNPAY: Order/OrderItem/Payment/PaymentAttempt/Shipment/address snapshot được giữ nguyên qua browser return; chỉ valid IPN chuyển Payment và Order payment snapshot sang `paid`, đồng thời chỉ chuyển Order `new → confirmed`. Duplicate IPN không double effect. COD regression vẫn `pending/new`, không tạo provider attempt.
