# Payment Testing

Current tests cover COD-only pending behavior, unsupported providers, provider failure without fake success, same-state idempotency, pending/failed→paid, terminal-state regression rejection and webhook reference/amount/currency matching. Order MySQL integration proves COD amount/status/null provider reference.

After provider approval add official signature fixtures, invalid signature, timestamp/replay, duplicate event, unknown transaction, out-of-order events, already-paid retry and actual dedupe persistence integration.
# Prompt 27.1A coverage

- Provider registry approval and fail-closed gateway resolution.
- VNPAY environment completeness validation.
- Reversible migration, provider-event unique identity, and absence of raw payload storage.
- Canonical lifecycle/mapping and existing COD/Checkout regressions remain in the automated suite.
