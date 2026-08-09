# Payment Security Boundary

- Fail closed before exact provider signature verification.
- Adapter owns raw-body canonicalization, signature scheme and timestamp/replay tolerance.
- Never log signature, secret, raw auth token or sensitive payload.
- Browser return cannot mark paid.
- Validate Payment reference, amount and VND currency after verification.
- Duplicate events are business-idempotent; terminal states cannot regress.
- No PAN/CVV/bank password/stored-card processing in HealthyHub.
