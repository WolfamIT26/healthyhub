# Payment Backend Contract

`PaymentLifecyclePolicy` centralizes monotonic canonical transitions. `OrderPaymentMappingPolicy` produces limited effects instead of mutating Order directly. `PaymentProviderGateway` defines create/query/raw-webhook verification and normalized events with reference, amount and currency. `PaymentWebhookEventRepository` defines dedupe/audit persistence, but has no implementation until provider event semantics are approved.

Pipeline: receive raw bytes/headers → adapter signature/timestamp verification → normalized event → `(provider,eventId)` lookup → resolve Payment → reference/amount/currency validation → lifecycle policy → Order effect policy → audit.
