# Prompt 27.1A — VNPAY Decision & Dedupe Persistence

VNPAY is approved for HealthyHub V1. The API now exposes an approved-provider registry decision, validates the future VNPAY configuration boundary, and persists provider events with a concurrency-safe unique identity and transactional business-effect completion.

No VNPAY adapter, external request, payment URL generation, webhook endpoint, capture, refund, secret, or fake success was introduced. COD and Checkout behavior remain unchanged. The next allowed scope is Prompt 27.2.
