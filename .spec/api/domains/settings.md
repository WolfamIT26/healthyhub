# Settings API Specification / Đặc tả API cấu hình

## API Overview / Tổng quan API

Settings API quản lý cấu hình storefront public, cấu hình cửa hàng, feature flag, policy vận hành, payment/shipping/notification/AI settings và SaaS readiness. Secret config không trả qua API public hoặc admin thông thường.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/public/settings/storefront` | Cấu hình storefront public | Public | Public |
| GET | `/api/v1/admin/settings` | Danh sách settings admin | Admin JWT | `settings:read` |
| GET | `/api/v1/admin/settings/{settingId}` | Chi tiết setting | Admin JWT | `settings:read` |
| PATCH | `/api/v1/admin/settings/{settingId}` | Cập nhật setting | Admin JWT | `settings:manage` |
| GET | `/api/v1/admin/settings/feature-flags` | Danh sách feature flag | Admin JWT | `settings:read` |
| PATCH | `/api/v1/admin/settings/feature-flags/{flagKey}` | Cập nhật feature flag | Admin JWT | `settings:manage` |
| GET | `/api/v1/admin/settings/security` | Xem security policy summary | Admin JWT | `settings:read` |
| PATCH | `/api/v1/admin/settings/security` | Cập nhật security policy | Admin JWT | `settings:manage` |
| GET | `/api/v1/admin/settings/integrations` | Xem integration summary | Admin JWT | `settings:read` |

## REST Resource / Tài nguyên REST

- Primary resource: `settings`.
- Sub resources: `storefront`, `feature-flags`, `security`, `integrations`.

## HTTP Method / Phương thức HTTP

- GET cho public/admin settings.
- PATCH cho cập nhật setting/policy/feature flag.

## URI Convention / Quy ước URI

- Public namespace: `/api/v1/public/settings`.
- Admin namespace: `/api/v1/admin/settings`.
- ID/key parameter dùng `{settingId}` hoặc `{flagKey}`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Public chỉ xem storefront settings an toàn.
- Admin đọc/cập nhật settings.
- Super Admin scope dành cho SaaS/multi-tenant tương lai.

## Authentication / Xác thực

- Public storefront không cần JWT.
- Admin settings bắt buộc Admin JWT.

## Authorization / Phân quyền

- Secret config không được trả raw.
- Security/payment/shipping/AI settings cần admin permission cao.
- Feature flag có thể tenant-scoped trong tương lai.

## Request Contract / Contract request

- Setting update dùng command input có value theo type và scope.
- Security policy update cần reason.
- Feature flag update nên theo desired state.

## Response Contract / Contract response

- Public storefront settings chỉ trả dữ liệu an toàn cho UI.
- Admin settings trả setting summary/value theo scope, không trả secret raw.
- Integration summary trả provider configured status, không trả credential.

## Error Contract / Contract lỗi

- `PERMISSION.SETTINGS.ADMIN_REQUIRED`
- `VALIDATION.SETTINGS.INVALID_VALUE`
- `BUSINESS.SETTINGS.SECRET_NOT_EXPOSED`
- `CONFLICT.COMMON.VERSION_CONFLICT`

## Validation Rule / Quy tắc validation

- Setting key hợp lệ.
- Value đúng type và schema đã định.
- Scope hợp lệ: system, tenant, user hoặc feature.
- Không nhận secret qua endpoint không dành cho secret management.

## Business Rule / Quy tắc nghiệp vụ

- Không làm tắt cấu hình bảo mật nền nếu không có approval.
- Feature flag ảnh hưởng production cần audit.
- Public settings không chứa dữ liệu nhạy cảm.

## Pagination / Phân trang

- Admin settings list có thể dùng pagination default 50.

## Filter / Lọc

- Lọc theo settingScope, group, visibility, updatedAt.

## Search / Tìm kiếm

- Search theo setting key, label hoặc group.

## Sort / Sắp xếp

- Default sort theo group và key.

## Upload / Upload

Không áp dụng trực tiếp.

## Download / Download

Export settings nếu có phải masking secret và cần admin permission, chưa là endpoint bắt buộc.

## Rate Limit / Giới hạn gọi API

- Public storefront: Public Normal.
- Admin setting update: Strict.

## Idempotency / Chống gửi lặp

- Feature flag và setting update nên idempotent theo desired value.

## Webhook / Webhook

Không áp dụng.

## AI Endpoint / Endpoint AI

AI settings chỉ quản lý cấu hình summary. AI provider/model chi tiết và secret không trả raw; AI capability sử dụng qua AI API.

