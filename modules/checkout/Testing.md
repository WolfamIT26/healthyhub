# Checkout Testing

Frontend tests cover unverified policy, authoritative Cart load, empty Cart, address validation, COD/manual rendering, Shipping quote/fee, summary, loading/double submit, persisted success, failure and same-key retry. Existing RouteGuard regression covers Guest/Internal denial.

Backend Order/MySQL integration continues to prove owner, Order/Item/Payment/Shipment/address persistence, totals, idempotency and rollback. Browser visual verification is **BLOCKED** because the in-app browser execution connection is unavailable; this is not a functional test failure.

Prompt 27.3 bổ sung frontend Return→Result reload test và MySQL VNPAY flow kiểm tra browser return read-only, IPN authoritative, duplicate dedupe, Payment→Order mapping, toàn bộ snapshot rows và COD regression. Real Sandbox E2E vẫn blocked riêng do credentials/public IPN callback chưa có.
