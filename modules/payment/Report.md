# VNPAY Decision & Event Dedupe Report — Prompt 27.1A

## Output matrix

| Boundary | Status |
| --- | --- |
| COD | **READY** |
| Payment Persistence | **READY** for COD Payment and generic provider-event dedupe |
| Payment Lifecycle | **READY** — canonical shared statuses and monotonic transition policy |
| Order-Payment Mapping | **READY** — centralized safe effects; no arbitrary Order mutation |
| Webhook Contract | **READY** — raw body/headers, adapter verification, normalized event, amount/currency/reference checks |
| Webhook Deduplication | **READY** — atomic claim, retry after failed, terminal rejected/processed, unique provider event identity |
| Provider Decision | **APPROVED — VNPAY** |
| VNPAY Configuration | **READY** — validated foundation and documented env keys; no real credentials committed |
| Online Payment Integration | **READY FOR PROMPT 27.2** — adapter/provider calls remain intentionally absent |

## Remaining unlocks

Prompt 27.2 must implement the real VNPAY adapter, checksum/IPN verification and online payment attempt flow against official documentation. Browser return remains non-authoritative. Physical online payment status harmonization remains an explicit implementation prerequisite. No provider call, SDK, secret, capture, refund or fake success was added here.
