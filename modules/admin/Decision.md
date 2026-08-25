# Admin Decision / Quyết định Admin

## D-ADM-001 — Reuse Internal roles / Tái sử dụng role nội bộ

Dashboard phục vụ `STAFF`, `MANAGER`, `ADMINISTRATOR` theo spec; không gộp chúng thành một role Admin mới. `InternalRoles()` chỉ là reusable metadata trên canonical roles.

## D-ADM-002 — Existing Analytics route / Route Analytics hiện có

Reuse `GET /admin/analytics/dashboard` và operationId hiện hữu để giữ OpenAPI 196. Không tạo `/admin/dashboard` authority song song.

## D-ADM-003 — Direct aggregate / Aggregate trực tiếp

V1 query persistence thật, không cache/materialized analytics. Chỉ metric có authority được hiển thị.

## D-ADM-004 — Moderation remains blocked / Moderation tiếp tục blocked

Không mở Admin Review operations cho tới khi reason, re-publish, audit và role policy được duyệt.
