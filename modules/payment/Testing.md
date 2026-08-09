# Payment Testing

Current tests cover COD-only pending behavior, unsupported providers, provider failure without fake success, same-state idempotency, pending/failed→paid, terminal-state regression rejection and webhook reference/amount/currency matching. Order MySQL integration proves COD amount/status/null provider reference.

After provider approval add official signature fixtures, invalid signature, timestamp/replay, duplicate event, unknown transaction, out-of-order events, already-paid retry and actual dedupe persistence integration.
