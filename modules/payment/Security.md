# Payment Security Boundary

- Fail closed before exact provider signature verification.
- Adapter owns raw-body canonicalization, signature scheme and timestamp/replay tolerance.
- Never log signature, secret, raw auth token or sensitive payload.
- Browser return cannot mark paid.
- Validate Payment reference, amount and VND currency after verification.
- Duplicate events are business-idempotent; terminal states cannot regress.
- No PAN/CVV/bank password/stored-card processing in HealthyHub.
# Prompt 27.1A controls

- Unique `(tenant_id, provider, provider_event_id)` prevents duplicate terminal effects.
- Raw webhook payload and signature are not persisted; only a SHA-256 hash boundary is stored.
- VNPAY selection fails closed when required configuration is missing; real secrets remain outside Git.

# Prompt 27.2 controls

- VNPAY secret chỉ đọc từ backend environment, không xuất hiện trong `VITE_*` hoặc frontend bundle.
- Signature verification dùng server-side constant-time comparison boundary.
- Provider amount/currency/reference phải khớp Payment authoritative trước khi transition.
- IPN invalid/duplicate/amount mismatch trả acknowledgment an toàn và không apply business effect.
- User-facing UI không render internal signature, raw payload hoặc debug provider detail.

# Prompt 27.3 controls / Kiểm soát Prompt 27.3

- Checksum canonicalization URL-encode đúng query string VNPAY trước HMAC SHA512.
- Callback phải khớp configured terminal, signed provider reference và persisted Order/Payment/attempt amount.
- Browser return không ghi Payment/Order/provider-event dù query báo thành công.
- IPN xử lý với row locks; callback duplicate đã processed mới nhận success idempotent, event đang xử lý/conflict fail closed để provider retry.
- QueryDr có timeout 10 giây và xác minh checksum/terminal/reference response.
