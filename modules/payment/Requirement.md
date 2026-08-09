# Payment Provider Requirements

- Exactly one approved provider adapter behind `PaymentProviderGateway`.
- Create amount/currency come from persisted Payment/Order only.
- Persist attempts without overwriting prior provider transactions.
- Verify raw webhook body/signature/timestamp exactly per official provider scheme before parsing business effect.
- Unique `(provider,eventId)` dedupe and payload hash; never store raw credentials/card data.
- Reject reference/amount/currency mismatch and illegal lifecycle regression.
- Browser return only queries/displays current server status.
