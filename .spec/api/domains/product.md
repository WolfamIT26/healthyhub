# Product API Specification / Đặc tả API sản phẩm

## API Overview / Tổng quan API

Product API quản lý sản phẩm healthy, thông tin bán hàng, trạng thái hiển thị, thành phần, giá, hình ảnh liên quan và dữ liệu public cho storefront.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/public/products` | Danh sách sản phẩm public | Public | Public |
| GET | `/api/v1/public/products/{productId}` | Chi tiết sản phẩm public | Public | Public |
| GET | `/api/v1/public/products/options` | Option sản phẩm cho filter/search | Public | Public |
| GET | `/api/v1/admin/products` | Danh sách sản phẩm admin | Staff/Manager/Admin JWT | `products:read` |
| GET | `/api/v1/admin/products/options` | Lookup Category/Brand/dietary/existing Media cho Product form | Staff/Manager/Admin JWT | `products:read` |
| POST | `/api/v1/admin/products` | Tạo sản phẩm | Staff/Manager/Admin JWT | `products:manage` |
| GET | `/api/v1/admin/products/{productId}` | Chi tiết sản phẩm admin | Staff/Manager/Admin JWT | `products:read` |
| PATCH | `/api/v1/admin/products/{productId}` | Cập nhật sản phẩm | Staff/Manager/Admin JWT | `products:manage` |
| DELETE | `/api/v1/admin/products/{productId}` | Xóa mềm sản phẩm | Manager/Admin JWT | `products:manage` |
| PATCH | `/api/v1/admin/products/{productId}/status` | Đổi trạng thái sản phẩm | Manager/Admin JWT | `products:manage` |
| POST | `/api/v1/admin/products/{productId}/media` | Gắn media vào sản phẩm | Staff/Manager/Admin JWT | `products:manage` |
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
- Prompt 35 create/update dùng typed full aggregate; SKU chỉ có ở create và immutable sau đó; update/status/delete bắt buộc `version`.
- DTO không nhận `tenantId`, `sellableStatus`, Inventory quantity hoặc audit fields.
- Import/export dùng file transfer contract.
- Media attach dùng relationship reference.

## Response Contract / Contract response

- Public list item: name, image, price, summary, stock status, visible attributes.
- Public detail: thông tin bán hàng, thành phần, category/brand summary, media public và review summary nếu include.
- Admin detail: thêm status, audit summary, internal notes và inventory link theo quyền.
- Prompt 35 Admin detail trả Product/Content/Nutrition/Ingredient/Dietary/Category/Brand/Media relation, timestamps/version và availability read-only; không trả raw storage key.
- Prompt 31 executable public response dùng Product/Category/Brand/Content/Ingredient/Dietary/Nutrition/Media persistence; không trả cost, supplier, audit metadata hoặc raw storage key.

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
- Primary Category phải nằm trong assigned Category list; quan hệ phải active/cùng tenant; ingredient và Media-role không trùng.

## Business Rule / Quy tắc nghiệp vụ

- Sản phẩm chỉ được public khi đủ dữ liệu bán hàng tối thiểu.
- Không hard delete sản phẩm đã có order history.
- Giá trị tồn kho public lấy từ Inventory contract, không nhận từ client product update.
- Prompt 35 create luôn `draft + hidden + unavailable` và không tạo Inventory row giả.
- Public requires Product `active + public`, published Content và active/public primary Category; availability vẫn do Inventory quyết định.
- Delete là Product soft-delete, không cascade Order Item/Review/Inventory/relationship history.

## Prompt 35 Executable Admin Contract / Contract Admin chạy Prompt 35

- Executable: Admin list/options/detail/create/update/status/soft-delete.
- List query exact: `page`, `pageSize`, `q`, `productStatus`, `visibility`, `categoryId`, `brandId`, approved `sort`.
- Aggregate replacement chạy trong transaction, khóa Product, kiểm tra optimistic `version` và reconcile child rows deterministic.
- Separate media attach/import/export operations vẫn blocked; Product aggregate create/update có thể link existing active Product image Media.

## Pagination / Phân trang

- Public list default 20, max 60.
- Admin list default 20, max 60.

## Filter / Lọc

- Public executable: `category`, `brand` (numeric ID hoặc slug), `dietary` (all-match), `minPrice`, `maxPrice`, `availability`.
- Admin: thêm `productStatus`, `createdAt`, `updatedAt`, `visibility`.

## Search / Tìm kiếm

- Search theo product name, code, slug, summary và ingredient keywords.
- AI semantic search dùng AI API, không thay thế product list API.

## Sort / Sắp xếp

- Public default: featured trước, sau đó updated hoặc best-selling khi có dữ liệu.
- Admin default: `updatedAt` desc.
- Prompt 31 whitelist: `featured`, `newest`, `name-asc`, `name-desc`, `price-asc`, `price-desc`; luôn có Product ID tie-breaker.
- Review aggregate đã executable qua endpoint Review riêng; Product list vẫn không bật `rating`/`best-selling` sort vì repository Product chưa implement các sort đó.

## Prompt 31 Executable Contract

- `GET /api/v1/public/products`: page mặc định 1, pageSize mặc định 20/tối đa 60; `q` tối đa 100 ký tự.
- `GET /api/v1/public/products/{productId}`: `{productId}` nhận BIGINT hoặc canonical slug; hidden/inactive/deleted trả 404.
- `GET /api/v1/public/products/options`: Category, Brand và dietary option public-safe cho Catalog/Search.
- Availability/sellable do Product + Inventory authority quyết định; browser không gửi hoặc override giá/stock.

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
