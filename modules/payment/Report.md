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

## Prompt 27.2 — VNPAY Sandbox Integration

Payment module đã có adapter VNPAY phía sau `PaymentProviderGateway`, tạo payment URL từ Order/Payment đã persist, ký request bằng HMAC SHA512, verify return/IPN, query provider khi cần reconciliation và normalize provider result về lifecycle chung.

Business authority giữ ở backend:

- Frontend chỉ nhận redirect URL, không build params hoặc ký request.
- IPN/callback đã verify là nguồn authoritative để apply Payment transition và Order effect.
- Browser return chỉ trả trạng thái UX/pending/result sau khi backend xử lý.
- Provider event dedupe được reuse, duplicate callback không double update Order/Payment.
- COD không gọi provider và vẫn giữ Payment `pending`.

Không có production credential, refund, admin settlement, inventory mutation hoặc fake provider success trong scope này.

## Prompt 27.3 Verification / Kiểm tra Prompt 27.3

| Boundary / Ranh giới | Result / Kết quả |
| --- | --- |
| Automated VNPAY | **PASS** |
| Sandbox browser E2E | **BLOCKED — SANDBOX CREDENTIALS REQUIRED** |
| Real VNPAY IPN | **BLOCKED — HTTPS callback/credentials chưa cấu hình** |
| Payment → Order | **PASS** |
| COD regression | **PASS** |

MySQL signed-fixture flow chứng minh amount đi từ persisted Order, browser return không mutate, amount mismatch rollback, valid IPN commit Payment/attempt/Order và duplicate không double effect. Provider events chỉ lưu payload hash/canonical identity, không lưu raw callback/signature. Hai migration Prompt 27.2 còn pending trên development database đã được apply trước khi chạy verification.

Runtime hiện thiếu/chưa chọn `PAYMENT_PROVIDER=vnpay`, `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `VNPAY_PAYMENT_URL`, `VNPAY_API_URL`, `VNPAY_RETURN_URL`, `VNPAY_IPN_URL`. Không có credential nào được thêm vào repository.
