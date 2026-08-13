# Checkout Checklist

- [x] Audit Cart, Customer, Shipping, Payment và Order specifications.
- [x] Xác nhận Cart và verification policy READY.
- [x] Ghi blocker Shipping/Order/Payment chính xác.
- [x] Không fake fee, method, Order hoặc Payment success.
- [x] Shipping quote authority executable: manual, VN-only, `0.00 VND`, deterministic reference.
- [x] COD + VNPAY payment method foundation via backend capability.
- [x] Order persistence, immutable snapshot, transaction và idempotency executable.
- [x] MySQL integration chứng minh persistence, isolation, retry và rollback.
- [x] OpenAPI `POST /orders` có typed contract và Customer JWT-only.
- [x] Checkout frontend và Shipping quote integration thật.
- [x] Confirm gọi idempotent Order persistence, không fake success.
- [x] Guest/Internal/Unverified policy và Cart invalid states.
- [x] Automated Checkout/Cart/Order/Authentication regression.
- [ ] Browser visual verification — BLOCKED bởi in-app browser connection unavailable.

# Prompt 27.2

- [x] Render payment methods from backend capability.
- [x] Allow VNPAY selection only when backend reports enabled.
- [x] Create Order before redirecting to VNPAY.
- [x] Query backend after VNPAY return for authoritative state.
- [x] Preserve COD regression boundary.
- [x] Keep no-fake-paid browser rule.

# Prompt 27.3 Verification / Kiểm tra Prompt 27.3

- [x] Browser return `paid` payload không tự cập nhật Payment/Order.
- [x] Result screen reload/direct access gọi Payment status backend.
- [x] MySQL flow giữ Order/Shipment/address snapshots qua redirect/return/IPN.
- [x] COD vẫn pending và không tạo provider attempt.
- [ ] Checkout → VNPAY Sandbox browser E2E thật — **BLOCKED — SANDBOX CREDENTIALS REQUIRED**.
