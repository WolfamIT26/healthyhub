# Payment Testing

Current tests cover COD and VNPAY supported-method behavior, unsupported providers, provider failure without fake success, same-state idempotency, pending/failed→paid, terminal-state regression rejection, webhook reference/amount/currency matching and VNPAY return/IPN/query normalization. Order MySQL integration proves COD/VNPAY amount/status/provider reference persistence.

After provider approval add official signature fixtures, invalid signature, timestamp/replay, duplicate event, unknown transaction, out-of-order events, already-paid retry and actual dedupe persistence integration.
# Prompt 27.1A coverage

- Provider registry approval and fail-closed gateway resolution.
- VNPAY environment completeness validation.
- Reversible migration, provider-event unique identity, and absence of raw payload storage.
- Canonical lifecycle/mapping and existing COD/Checkout regressions remain in the automated suite.

# Prompt 27.2 coverage

- VNPAY signed payment URL generation and amount transformation.
- VNPAY return/IPN/query verification with query-response checksum.
- Duplicate callback dedupe and canonical status normalization.
- Checkout result reload/direct-access behavior against backend authoritative state.

# Prompt 27.3 coverage / Bao phủ Prompt 27.3

- Official URL-encoded checksum, invalid signature, wrong terminal và unsuccessful/cancelled/pending mappings.
- Browser return `00/00` remains read-only and claims no provider event.
- Persisted Order/Payment/attempt amount cross-check and fail-closed mismatch.
- MySQL aggregate flow verifies invalid signature, failed mismatch event, valid IPN, duplicate IPN, reload, Payment→Order mapping, all snapshot rows and COD regression.
- Real Sandbox redirect/IPN is not represented by fixtures and remains explicitly blocked.
