# Admin Testing / Kiểm thử Admin

## Backend coverage / Coverage backend

- Guest 401; Customer 403; Internal actor + permission PASS.
- Disabled/locked/deleted/session mismatch bị reject.
- Forged/stale JWT Admin role không vượt current persisted Customer role.
- Dashboard service không tạo PII/financial/pending-moderation fields.
- MySQL aggregate test xác nhận tenant isolation và Product/Inventory/Order/Review counts.

## Frontend coverage / Coverage frontend

- Guest redirect, Customer forbidden, Internal access và reload loading.
- Responsive Admin navigation; future modules disabled.
- Dashboard loading, authoritative render, empty, error/retry và forbidden.
- Logout và account switch không giữ actor Admin cũ.

Kết quả command cuối được ghi trong `Report.md` và Work Summary Prompt 34.
