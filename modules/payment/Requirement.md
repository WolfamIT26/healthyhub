# Payment Provider Requirements

- Exactly one approved provider adapter behind `PaymentProviderGateway`.
- Create amount/currency come from persisted Payment/Order only.
- Persist attempts without overwriting prior provider transactions.
- Verify raw webhook body/signature/timestamp exactly per official provider scheme before parsing business effect.
- Unique `(provider,eventId)` dedupe and payload hash; never store raw credentials/card data.
- Reject reference/amount/currency mismatch and illegal lifecycle regression.
- Browser return only queries/displays current server status.
# Prompt 27.1A

- VNPAY is the approved HealthyHub V1 online payment provider.
- Provider events require durable deduplication before Prompt 27.2 may apply webhook business effects.
- Browser return is non-authoritative; no real provider call is part of this prompt.

# Prompt 27.2 requirements resolved

- Backend generates VNPAY Sandbox URL from persisted Order/Payment only.
- Signature generation and verification happen only server-side.
- VNPAY IPN/callback is fail-closed on invalid signature, amount mismatch or unknown transaction.
- Supported payment methods are discovered from backend, not hard-coded separately in Checkout.
- Refund, settlement, chargeback and production credential handling remain out of scope.
