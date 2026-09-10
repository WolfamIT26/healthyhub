# Admin API / API Admin

## Executable operation / Operation đã chạy

`GET /api/v1/admin/analytics/dashboard`

- Auth: Bearer access token với session/account hiện hành.
- Role: `STAFF|MANAGER|ADMINISTRATOR`.
- Permission: `analytics:read`, resolve từ persistence.
- Input: không body/query tenant/role/permission.
- Output: typed Product, Order, Review aggregates và `generatedAt`.
- Errors: 401 Guest/token/session invalid; 403 Customer/disabled/no permission; 423 locked actor.

Prompt 35 also opens executable Admin Product operations:

| Method | URI | Permission | Runtime |
| --- | --- | --- | --- |
| GET | `/api/v1/admin/products` | `products:read` | Ready |
| GET | `/api/v1/admin/products/options` | `products:read` | Ready |
| POST | `/api/v1/admin/products` | `products:manage` | Ready |
| GET | `/api/v1/admin/products/{productId}` | `products:read` | Ready |
| PATCH | `/api/v1/admin/products/{productId}` | `products:manage` | Ready |
| PATCH | `/api/v1/admin/products/{productId}/status` | `products:manage` | Ready |
| DELETE | `/api/v1/admin/products/{productId}` | `products:manage` | Ready |

OpenAPI inventory is now 198 operations because Prompt 35 adds Admin Product options and soft-delete operations. Media attach, import and export remain blocked.
