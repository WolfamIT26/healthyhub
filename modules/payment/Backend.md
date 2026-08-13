# Payment Backend Contract

`PaymentLifecyclePolicy` centralizes monotonic canonical transitions. `OrderPaymentMappingPolicy` produces limited effects instead of mutating Order directly. `PaymentProviderGateway` defines create/query/raw-webhook verification and normalized events with reference, amount and currency. `PaymentWebhookEventRepository` defines dedupe/audit persistence, but has no implementation until provider event semantics are approved.

Pipeline: receive raw bytes/headers → adapter signature/timestamp verification → normalized event → `(provider,eventId)` lookup → resolve Payment → reference/amount/currency validation → lifecycle policy → Order effect policy → audit.
# Prompt 27.1A foundation

- Approved provider: `vnpay`; registry decision is available while gateway resolution remains fail-closed until Prompt 27.2 supplies an adapter.
- `payment_provider_events` owns provider event identity, payload hash and processing state. `completeWithBusinessEffect` commits the business effect and `processed` marker in one transaction.
- Failed processing is explicitly marked `failed` and may be claimed again. `processed` and `rejected` events are terminal.

# Prompt 27.2 backend implementation

- `VnpayPaymentGateway` maps persisted Payment attempt data to official VNPAY Sandbox params and signs requests server-side.
- Payment presentation service creates VNPAY intents only for authenticated Order owners and authoritative Order totals.
- Return handling is UX-oriented; IPN/callback/query path is authoritative for Payment transition.
- Provider event dedupe is reused; duplicate or concurrent IPN delivery cannot double apply business effects.
- Provider-specific data is normalized before leaving Payment boundary; Order only sees approved canonical effect.
