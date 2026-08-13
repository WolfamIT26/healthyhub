# Payment Checklist

- [x] COD regression preserved.
- [x] Canonical lifecycle and event-order rules.
- [x] Central Order effect policy.
- [x] Browser return versus webhook authority.
- [x] Amount/currency/reference validation contract.
- [x] Provider decision matrix without invented fee.
- [x] User approves exactly one provider: VNPAY.
- [x] Provider-specific signature/replay adapter.
- [x] Webhook dedupe migration/repository.
- [x] Online Payment integration for VNPAY Sandbox.
# Prompt 27.1A

- [x] Approve VNPAY decision and retain fail-closed adapter resolution
- [x] Add validated VNPAY config keys without secrets
- [x] Add generic event dedupe entity/repository/migration
- [x] Verify duplicate, concurrent, failure retry, rejection, reload and transactional rollback behavior on MySQL
- [x] Verify migration run/rollback/run
- [x] Preserve COD and Checkout regressions
- [x] Implement real VNPAY adapter, request signing and IPN endpoint (Prompt 27.2 only)

# Prompt 27.2

- [x] Generate VNPAY payment URL server-side after Order/Payment persistence.
- [x] Keep authoritative amount/currency/reference on backend.
- [x] Verify VNPAY signature for return/IPN.
- [x] Process IPN/callback through provider event dedupe.
- [x] Normalize VNPAY status into canonical Payment lifecycle.
- [x] Apply approved Order effect only after verified success.
- [x] Expose COD + VNPAY from backend supported methods.
- [x] Add frontend redirect, return and result UX without frontend-paid authority.
- [x] Keep COD regression boundary unchanged.
- [ ] VNPAY Sandbox end-to-end with real credentials — blocked until sandbox credentials are configured locally.

# Prompt 27.3 Verification / Kiểm tra Prompt 27.3

- [x] Audit runtime env mà không đọc/in secret.
- [x] Canonical URL-encode checksum theo query string official.
- [x] Giữ browser return read-only đối với Payment/Order.
- [x] Verify terminal/reference/amount/currency và đúng payment attempt.
- [x] IPN authoritative, transactional và duplicate idempotent.
- [x] Map mọi mã VNPAY không thành công khỏi trạng thái `pending`, riêng mã hủy sang `cancelled`.
- [x] Reload Payment Result từ backend authoritative state.
- [x] Verify Order/OrderItem/Payment/PaymentAttempt/Shipment/address/provider-event trên MySQL.
- [x] Verify COD regression.
- [ ] VNPAY Sandbox E2E/IPN thật — **BLOCKED — SANDBOX CREDENTIALS REQUIRED**.
