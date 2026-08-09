# Checkout Checklist

- [x] Audit Cart, Customer, Shipping, Payment và Order specifications.
- [x] Xác nhận Cart và verification policy READY.
- [x] Ghi blocker Shipping/Order/Payment chính xác.
- [x] Không fake fee, method, Order hoặc Payment success.
- [x] Shipping quote authority executable: manual, VN-only, `0.00 VND`, deterministic reference.
- [x] COD-only Payment method foundation; future/unsupported methods rejected.
- [x] Order persistence, immutable snapshot, transaction và idempotency executable.
- [x] MySQL integration chứng minh persistence, isolation, retry và rollback.
- [x] OpenAPI `POST /orders` có typed contract và Customer JWT-only.
- [x] Checkout frontend và Shipping quote integration thật.
- [x] Confirm gọi idempotent Order persistence, không fake success.
- [x] Guest/Internal/Unverified policy và Cart invalid states.
- [x] Automated Checkout/Cart/Order/Authentication regression.
- [ ] Browser visual verification — BLOCKED bởi in-app browser connection unavailable.
