# Admin API / API Admin

## Executable operation / Operation đã chạy

`GET /api/v1/admin/analytics/dashboard`

- Auth: Bearer access token với session/account hiện hành.
- Role: `STAFF|MANAGER|ADMINISTRATOR`.
- Permission: `analytics:read`, resolve từ persistence.
- Input: không body/query tenant/role/permission.
- Output: typed Product, Order, Review aggregates và `generatedAt`.
- Errors: 401 Guest/token/session invalid; 403 Customer/disabled/no permission; 423 locked actor.

Operation này đã có trong inventory OpenAPI; Prompt 34 không tăng tổng 196 operations.
