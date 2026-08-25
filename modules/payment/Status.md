# Payment Status

**Prompt 27.3 Automated Verification PASS — VNPAY Sandbox E2E/IPN thật BLOCKED.**

Lifecycle, mapping, provider-neutral gateway, checksum canonicalization, read-only browser return, authoritative IPN/callback, provider query và event dedupe đã pass automated/MySQL verification. COD remains executable and unchanged. E2E với VNPAY Sandbox thật bị chặn do runtime chưa có credentials và HTTPS public IPN callback.

Prompt 28 chỉ đọc canonical Payment row trong Customer Order list/detail; không sửa lifecycle hoặc browser/IPN authority.

Prompt 33.1 giữ Payment authority tách khỏi fulfillment: paid chỉ mở shipment readiness cho VNPAY, không đồng nghĩa delivered/completed. Late paid trên cancelled/returned Order yêu cầu reconciliation.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`

# Prompt 27.1A

**Complete — VNPAY approved; payment event dedupe persistence enabled. Ready for Prompt 27.2.**

# Prompt 27.2

**Complete — backend tạo VNPAY Sandbox payment URL thật, verify return/IPN server-side, normalize lifecycle và giữ frontend không tự mark `paid`.**
