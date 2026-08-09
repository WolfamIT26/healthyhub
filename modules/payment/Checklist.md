# Payment Checklist

- [x] COD regression preserved.
- [x] Canonical lifecycle and event-order rules.
- [x] Central Order effect policy.
- [x] Browser return versus webhook authority.
- [x] Amount/currency/reference validation contract.
- [x] Provider decision matrix without invented fee.
- [ ] User approves exactly one provider.
- [ ] Provider-specific signature/replay adapter.
- [ ] Webhook dedupe migration/repository.
- [ ] Online Payment integration.
# Prompt 27.1A

- [x] Approve VNPAY decision and retain fail-closed adapter resolution
- [x] Add validated VNPAY config keys without secrets
- [x] Add generic event dedupe entity/repository/migration
- [x] Verify duplicate, concurrent, failure retry, rejection, reload and transactional rollback behavior on MySQL
- [x] Verify migration run/rollback/run
- [x] Preserve COD and Checkout regressions
- [ ] Implement real VNPAY adapter, request signing and IPN endpoint (Prompt 27.2 only)
