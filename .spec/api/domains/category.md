# Category API Specification / Đặc tả API danh mục

## API Overview / Tổng quan API

Category API quản lý danh mục sản phẩm, cây danh mục, thứ tự hiển thị và trạng thái public/admin.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/public/categories` | Danh sách danh mục public | Public | Public |
| GET | `/api/v1/public/categories/tree` | Cây danh mục public | Public | Public |
| GET | `/api/v1/public/categories/{categoryId}` | Chi tiết danh mục public | Public | Public |
| GET | `/api/v1/admin/categories` | Danh sách danh mục admin | Staff JWT | `categories:read` |
| POST | `/api/v1/admin/categories` | Tạo danh mục | Manager/Admin JWT | `categories:manage` |
| GET | `/api/v1/admin/categories/{categoryId}` | Chi tiết danh mục admin | Staff JWT | `categories:read` |
| PATCH | `/api/v1/admin/categories/{categoryId}` | Cập nhật danh mục | Manager/Admin JWT | `categories:manage` |
| PATCH | `/api/v1/admin/categories/{categoryId}/status` | Đổi trạng thái danh mục | Manager/Admin JWT | `categories:manage` |
| PATCH | `/api/v1/admin/categories/reorder` | Sắp xếp danh mục | Manager/Admin JWT | `categories:manage` |

## REST Resource / Tài nguyên REST

- Primary resource: `categories`.
- Action resources: `tree`, `status`, `reorder`.

## HTTP Method / Phương thức HTTP

- GET cho list/tree/detail.
- POST cho create.
- PATCH cho update/status/reorder.

## URI Convention / Quy ước URI

- Public namespace: `/api/v1/public/categories`.
- Admin namespace: `/api/v1/admin/categories`.
- ID parameter dùng `{categoryId}`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Public xem danh mục active.
- Staff đọc admin.
- Manager/Admin quản lý.

## Authentication / Xác thực

- Public endpoint không cần JWT.
- Admin endpoint bắt buộc Staff JWT trở lên.

## Authorization / Phân quyền

- Public không thấy inactive/archived.
- Reorder và status change cần `categories:manage`.

## Request Contract / Contract request

- Category create/update dùng command input.
- Tree/list dùng query input.
- Reorder dùng bulk/action request có giới hạn item.

## Response Contract / Contract response

- Public category tree trả ID, name, slug, parent summary và display order.
- Admin detail trả status, audit summary và product count nếu có.

## Error Contract / Contract lỗi

- `NOT_FOUND.CATEGORY.CATEGORY_NOT_FOUND`
- `BUSINESS.CATEGORY.HAS_ACTIVE_PRODUCTS`
- `CONFLICT.CATEGORY.SLUG_EXISTS`

## Validation Rule / Quy tắc validation

- Name/slug required và unique theo scope.
- Parent category nếu có phải tồn tại.
- Không tạo vòng lặp parent-child.
- Reorder payload có giới hạn số item.

## Business Rule / Quy tắc nghiệp vụ

- Không archive category còn sản phẩm active nếu rule không cho phép.
- Public category chỉ hiển thị khi active và có visibility phù hợp.

## Pagination / Phân trang

- Admin list dùng page pagination.
- Public tree có thể không phân trang nếu size nhỏ.

## Filter / Lọc

- Lọc theo `categoryStatus`, `parentId`, `visibility`.

## Search / Tìm kiếm

- Search theo name và slug.

## Sort / Sắp xếp

- Default sort theo `displayOrder`, sau đó name.

## Upload / Upload

Không áp dụng trực tiếp. Ảnh category nếu có đi qua Media API.

## Download / Download

Không áp dụng trong Prompt 10.

## Rate Limit / Giới hạn gọi API

- Public category: Public Normal.
- Admin management: Authenticated Normal.

## Idempotency / Chống gửi lặp

- Reorder nên idempotent theo desired order.

## Webhook / Webhook

Không áp dụng.

## AI Endpoint / Endpoint AI

Không áp dụng trực tiếp. AI Search có thể dùng category source qua AI API.

