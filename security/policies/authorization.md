# Authorization / Phân quyền

## Rule / Quy tắc

- API nhạy cảm phải kiểm tra quyền.
- Quyền cần được mô tả trong `API.md`.
- Không chỉ dựa vào frontend để ẩn chức năng.

## Admin V1 / Admin V1

- Admin namespace yêu cầu Bearer session active và account active.
- Internal access dùng persisted `STAFF`, `MANAGER`, `ADMINISTRATOR`; không có role Admin song song hoặc email/user-ID allowlist.
- Backend resolve current roles/effective permissions từ persistence sau khi verify token/session.
- `GET /api/v1/admin/analytics/dashboard` yêu cầu `analytics:read`; tenant đơn V1 được derive server-side.
- Frontend guard/navigation chỉ là UX; backend là authority cuối.
