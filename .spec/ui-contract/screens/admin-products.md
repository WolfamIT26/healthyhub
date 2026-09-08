# Admin Products Screen / Màn hình quản lý sản phẩm

## Screen Overview / Tổng quan màn hình

Admin Products cho Internal users quản lý danh sách, tạo, sửa, đổi lifecycle và soft-delete sản phẩm từ Product persistence thật.

## Business Goal / Mục tiêu kinh doanh

Giữ dữ liệu sản phẩm chính xác, đủ điều kiện bán và dễ quản lý vận hành.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/admin/products` | Danh sách và quản lý sản phẩm. |
| `/admin/products/new` | Tạo sản phẩm mới. |
| `/admin/products/:productId` | Chi tiết/form sản phẩm. |

## Permission / Phân quyền

`products:read` cho list/detail/options. `products:manage` cho create/update/status/delete. Backend là authorization authority.

## Required API / API bắt buộc

- `GET /api/v1/admin/products`.
- `GET /api/v1/admin/products/options`.
- `POST /api/v1/admin/products`.
- `GET /api/v1/admin/products/{productId}`.
- `PATCH /api/v1/admin/products/{productId}`.
- `PATCH /api/v1/admin/products/{productId}/status`.
- `DELETE /api/v1/admin/products/{productId}`.

Blocked operations: standalone media attach, import and export.

## Required Data / Dữ liệu bắt buộc

Product admin list/detail, Category/Brand options, existing Product image Media options, lifecycle state, version and read-only Inventory availability.

## UI Sections / Khu vực UI

Product table, filter/search/sort, product form, existing media selection, status action and soft-delete action.

## Components / Thành phần

Admin Table, Filter Bar, Product Form, Status Badge, Existing Media Picker, Confirmation Dialog.

## Form / Form

Product create/update form với name, SKU, slug, price, brand, categories/primary category, content, nutrition, ingredients, dietary tags, existing media and publication fields. SKU is read-only after create.

## Validation / Validation

Required fields, unique code/slug, DecimalString price, valid category/brand/media references, one primary category and version on update/status/delete.

## Search / Tìm kiếm

Search theo product name, SKU, slug, summary và ingredient keywords.

## Filter / Lọc

Category, brand, productStatus, visibility and approved sort only. Availability may be displayed read-only.

## Sort / Sắp xếp

Default `updatedAt` desc; sort theo price, name, createdAt, updatedAt nếu API cho phép.

## Pagination / Phân trang

Default 20, max 60.

## Upload / Upload

No upload in Prompt 35. The form can link existing active Product image Media only.

## Download / Download

Export job remains blocked in Prompt 35.

## Loading State / Trạng thái tải

Table skeleton and form disabled while loading/submitting.

## Empty State / Trạng thái rỗng

Chưa có sản phẩm hoặc không có kết quả theo filter; hiển thị action tạo mới nếu có quyền.

## Error State / Trạng thái lỗi

Validation error, slug conflict, product not found, stale version, permission denied.

## Success State / Trạng thái thành công

Sản phẩm lưu thành công, lifecycle updated or soft-delete completed, followed by authoritative refetch/navigation.

## Confirmation Dialog / Hộp xác nhận

Publish/unpublish/soft-delete actions need confirmation when destructive or visibility-changing.

## Toast Message / Toast

Tạo/sửa/đổi lifecycle/soft-delete thành công hoặc lỗi.

## Skeleton / Skeleton

Table skeleton giữ cột; detail skeleton giữ form groups.

## Responsive Behavior / Hành vi responsive

Desktop table-first; mobile chuyển sang compact list và form full-screen ở bước frontend sau.

## Accessibility / Khả năng tiếp cận

Form label rõ, status có text, action nguy hiểm có mô tả hậu quả.

## SEO Metadata / SEO metadata

Noindex vì là admin/private.
