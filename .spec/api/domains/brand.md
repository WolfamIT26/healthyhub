# Brand API Specification / Đặc tả API thương hiệu

## API Overview / Tổng quan API

Brand API quản lý thương hiệu/nhà sản xuất, logo, mô tả và trạng thái hiển thị liên quan sản phẩm healthy.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/public/brands` | Danh sách brand public | Public | Public |
| GET | `/api/v1/public/brands/{brandId}` | Chi tiết brand public | Public | Public |
| GET | `/api/v1/admin/brands` | Danh sách brand admin | Staff JWT | `brands:read` |
| POST | `/api/v1/admin/brands` | Tạo brand | Manager/Admin JWT | `brands:manage` |
| GET | `/api/v1/admin/brands/{brandId}` | Chi tiết brand admin | Staff JWT | `brands:read` |
| PATCH | `/api/v1/admin/brands/{brandId}` | Cập nhật brand | Manager/Admin JWT | `brands:manage` |
| PATCH | `/api/v1/admin/brands/{brandId}/status` | Đổi trạng thái brand | Manager/Admin JWT | `brands:manage` |
| POST | `/api/v1/admin/brands/{brandId}/media` | Gắn logo/media | Manager/Admin JWT | `brands:manage` |

## REST Resource / Tài nguyên REST

- Primary resource: `brands`.
- Related resource: `media`.
- Action resource: `status`.

## HTTP Method / Phương thức HTTP

- GET cho list/detail.
- POST cho create/media attach.
- PATCH cho update/status.

## URI Convention / Quy ước URI

- Public namespace: `/api/v1/public/brands`.
- Admin namespace: `/api/v1/admin/brands`.
- ID parameter dùng `{brandId}`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Public xem brand active.
- Staff đọc admin.
- Manager/Admin quản lý brand.

## Authentication / Xác thực

- Public endpoint không cần JWT.
- Admin endpoint bắt buộc Staff JWT trở lên.

## Authorization / Phân quyền

- Public không thấy inactive/archived.
- Status/media action cần quyền manage.

## Request Contract / Contract request

- Brand create/update dùng command input.
- Media attach dùng relationship reference.
- List dùng pagination/filter/search/sort.

## Response Contract / Contract response

- Public brand summary/detail trả name, slug, logo public và mô tả public.
- Admin detail trả status, audit summary và product count nếu có.

## Error Contract / Contract lỗi

- `NOT_FOUND.BRAND.BRAND_NOT_FOUND`
- `BUSINESS.BRAND.HAS_ACTIVE_PRODUCTS`
- `CONFLICT.BRAND.SLUG_EXISTS`

## Validation Rule / Quy tắc validation

- Name/slug required và unique.
- Logo media phải tồn tại, đúng purpose và actor có quyền.
- Status transition hợp lệ.

## Business Rule / Quy tắc nghiệp vụ

- Không archive brand còn sản phẩm active nếu rule không cho phép.
- Public chỉ trả brand visible.

## Pagination / Phân trang

- Public/admin list dùng page pagination.
- Prompt 31 public list mặc định 20, tối đa 60.

## Filter / Lọc

- Lọc theo `brandStatus`, `createdAt`, `updatedAt`.

## Search / Tìm kiếm

- Search theo name và slug.

## Sort / Sắp xếp

- Default sort theo name asc public, updatedAt desc admin.

## Prompt 31 Executable Contract

- Public list hỗ trợ `page`, `pageSize`, `q`; detail nhận numeric ID hoặc slug.
- Chỉ active Brand được trả; response gồm ID, slug, name, origin/description public và không có audit metadata.

## Upload / Upload

- Upload logo đi qua Media API.

## Download / Download

Không áp dụng trong Prompt 10.

## Rate Limit / Giới hạn gọi API

- Public: Public Normal.
- Admin management: Authenticated Normal.

## Idempotency / Chống gửi lặp

- Media attach nên idempotent nếu cùng media đã gắn.

## Webhook / Webhook

Không áp dụng.

## AI Endpoint / Endpoint AI

Không áp dụng trực tiếp.
