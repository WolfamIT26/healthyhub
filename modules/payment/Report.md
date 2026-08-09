# Payment Contract Resolution Report — Prompt 27.1

## Output matrix

| Boundary | Status |
| --- | --- |
| COD | **READY** |
| Payment Persistence | **READY** for primary COD Payment; online attempts await provider implementation |
| Payment Lifecycle | **READY** — canonical shared statuses and monotonic transition policy |
| Order-Payment Mapping | **READY** — centralized safe effects; no arbitrary Order mutation |
| Webhook Contract | **READY** — raw body/headers, adapter verification, normalized event, amount/currency/reference checks |
| Webhook Deduplication | **BLOCKED** — physical spec has no provider-event table and provider event semantics are not selected |
| Provider Decision | **PENDING USER DECISION** |
| Online Payment Integration | **BLOCKED** |

## Remaining unlocks

User must approve exactly one provider. Then verify its official onboarding/signature/replay/event-ID contract, add generic dedupe migration compatible with that contract, implement one adapter and harmonize physical `confirmed` to canonical `paid`. No provider call, SDK, secret, capture or fake webhook was added here.
