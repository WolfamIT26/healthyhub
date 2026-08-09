# Payment Security Boundary

- Fail closed before exact provider signature verification.
- Adapter owns raw-body canonicalization, signature scheme and timestamp/replay tolerance.
- Never log signature, secret, raw auth token or sensitive payload.
- Browser return cannot mark paid.
- Validate Payment reference, amount and VND currency after verification.
- Duplicate events are business-idempotent; terminal states cannot regress.
- No PAN/CVV/bank password/stored-card processing in HealthyHub.
# Prompt 27.1A controls

- Unique `(tenant_id, provider, provider_event_id)` prevents duplicate terminal effects.
- Raw webhook payload and signature are not persisted; only a SHA-256 hash boundary is stored.
- VNPAY selection fails closed when required configuration is missing; real secrets remain outside Git.
