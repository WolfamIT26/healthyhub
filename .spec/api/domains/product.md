# Product API Specification / Đặc tả API sản phẩm

## API Overview / Tổng quan API

Product API quản lý sản phẩm healthy, thông tin bán hàng, trạng thái hiển thị, thành phần, giá, hình ảnh liên quan và dữ liệu public cho storefront.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/public/products` | Danh sách sản phẩm public | Public | Public |
| GET | `/api/v1/public/products/{productId}` | Chi tiết sản phẩm public | Public | Public |
| GET | `/api/v1/public/products/options` | Option sản phẩm cho filter/search | Public | Public |
| GET | `/api/v1/admin/products` | Danh sách sản phẩm admin | Staff JWT | `products:read` |
| POST | `/api/v1/admin/products` | Tạo sản phẩm | Staff/Manager JWT | `products:manage` |
| GET | `/api/v1/admin/products/{productId}` | Chi tiết sản phẩm admin | Staff JWT | `products:read` |
| PATCH | `/api/v1/admin/products/{productId}` | Cập nhật sản phẩm | Staff/Manager JWT | `products:manage` |
| PATCH | `/api/v1/admin/products/{productId}/status` | Đổi trạng thái sản phẩm | Manager/Admin JWT | `products:manage` |
| POST | `/api/v1/admin/products/{productId}/media` | Gắn media vào sản phẩm | Staff/Manager JWT | `products:manage` |
| POST | `/api/v1/admin/products/imports` | Tạo job import sản phẩm | Manager/Admin JWT | `products:manage` |
| POST | `/api/v1/admin/products/exports` | Tạo job export sản phẩm | Manager/Admin JWT | `products:read` |

## REST Resource / Tài nguyên REST

- Primary resource: `products`.
- Related resources: `media`, `imports`, `exports`, `options`.
- Action resource: `status`.

## HTTP Method / Phương thức HTTP

- GET cho list/detail/options.
- POST cho create/import/export/media attach.
- PATCH cho update/status.

## URI Convention / Quy ước URI

- Public namespace: `/api/v1/public/products`.
- Admin namespace: `/api/v1/admin/products`.
- ID parameter dùng `{productId}`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Public chỉ xem sản phẩm active/visible.
- Staff có thể đọc/admin limited theo phân quyền.
- Manager/Admin quản lý status, import/export.

## Authentication / Xác thực

- Public endpoint không cần JWT.
- Admin endpoint bắt buộc Staff JWT trở lên.

## Authorization / Phân quyền

- Public không thấy draft, inactive, archived hoặc deleted.
- Staff limited không được publish/archive nếu không có quyền.
- Product media attach phải kiểm tra quyền media và product.

## Request Contract / Contract request

- Product query dùng pagination/filter/search/sort contract.
- Product create/update dùng command input, không nhận field audit tự sinh.
- Import/export dùng file transfer contract.
- Media attach dùng relationship reference.

## Response Contract / Contract response

- Public list item: name, image, price, summary, stock status, visible attributes.
- Public detail: thông tin bán hàng, thành phần, category/brand summary, media public và review summary nếu include.
- Admin detail: thêm status, audit summary, internal notes và inventory link theo quyền.

## Error Contract / Contract lỗi

- `NOT_FOUND.PRODUCT.PRODUCT_NOT_FOUND`
- `BUSINESS.PRODUCT.NOT_SELLABLE`
- `CONFLICT.PRODUCT.SLUG_EXISTS`
- `VALIDATION.COMMON.INVALID_INPUT`

## Validation Rule / Quy tắc validation

- Product name, code, slug đúng độ dài và unique theo scope.
- Price là DecimalString hợp lệ.
- Category/brand/media reference phải tồn tại và được phép dùng.
- Status transition phải hợp lệ.

## Business Rule / Quy tắc nghiệp vụ

- Sản phẩm chỉ được public khi đủ dữ liệu bán hàng tối thiểu.
- Không hard delete sản phẩm đã có order history.
- Giá trị tồn kho public lấy từ Inventory contract, không nhận từ client product update.

## Pagination / Phân trang

- Public list default 20, max 60.
- Admin list default 20, max 100.

## Filter / Lọc

- Public: `categoryId`, `brandId`, `price`, `stockStatus`, `productStatus` public-safe.
- Admin: thêm `productStatus`, `createdAt`, `updatedAt`, `visibility`.

## Search / Tìm kiếm

- Search theo product name, code, slug, summary và ingredient keywords.
- AI semantic search dùng AI API, không thay thế product list API.

## Sort / Sắp xếp

- Public default: featured trước, sau đó updated hoặc best-selling khi có dữ liệu.
- Admin default: `updatedAt` desc.
- Cho phép sort theo price, name, createdAt, updatedAt nếu được whitelist.

## Upload / Upload

- Upload ảnh đi qua Media API.
- Product API chỉ attach media đã upload.

## Download / Download

- Export sản phẩm dùng export contract và cần quyền `products:read`.

## Rate Limit / Giới hạn gọi API

- Public browse: Public Normal.
- Admin CRUD/import/export: Authenticated Normal hoặc Cost Strict với import/export.

## Idempotency / Chống gửi lặp

- Import/export cần idempotency key.
- Product create có thể chống trùng bằng product code/slug.

## Webhook / Webhook

Không áp dụng trực tiếp.

## AI Endpoint / Endpoint AI

AI product summary, ingredient explanation và recommendation nằm ở AI API. Product API chỉ cung cấp source contract cho AI khi có quyền.

