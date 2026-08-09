# Payment API Contract Status

Existing intent/status/webhook routes remain generic and non-executable until a provider is approved. Future intent request accepts Order reference/payment selection and idempotency header, never amount/status/currency override. Status response uses canonical shared Payment statuses. Webhook path remains provider-neutral and must fail before signature verification succeeds.
# Prompt 27.1A API boundary

No public API operation was added. The future VNPAY Return URL is non-authoritative; only a verified IPN/query path implemented in Prompt 27.2 may drive payment lifecycle changes.
