# Admin Products Screen / Màn hình quản lý sản phẩm

## Screen Overview / Tổng quan màn hình

Admin Products cho staff/manager/admin quản lý danh sách, tạo, sửa, đổi trạng thái, attach media, import và export sản phẩm.

## Business Goal / Mục tiêu kinh doanh

Giữ dữ liệu sản phẩm chính xác, đủ điều kiện bán và dễ quản lý vận hành.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/admin/products` | Danh sách và quản lý sản phẩm. |
| `/admin/products/:productId` | Chi tiết/form sản phẩm. |

## Permission / Phân quyền

Staff đọc theo scope; manager/admin quản lý.

## Required API / API bắt buộc

- `GET /api/v1/admin/products`.
- `POST /api/v1/admin/products`.
- `GET /api/v1/admin/products/{productId}`.
- `PATCH /api/v1/admin/products/{productId}`.
- `PATCH /api/v1/admin/products/{productId}/status`.
- `POST /api/v1/admin/products/{productId}/media`.
- `POST /api/v1/admin/products/imports`.
- `POST /api/v1/admin/products/exports`.

## Required Data / Dữ liệu bắt buộc

Product admin list/detail, category/brand option, media summary, status, audit summary, import/export job.

## UI Sections / Khu vực UI

Product table, filter/search/sort, product form, media attach panel, status action, import/export actions.

## Components / Thành phần

Admin Table, Filter Bar, Product Form, Status Badge, Media Picker, Upload Link, Confirmation Dialog.

## Form / Form

Product create/update form với name, code, slug, price, summary, category, brand, status và visible fields.

## Validation / Validation

Required fields, unique code/slug, DecimalString price, valid category/brand/media references.

## Search / Tìm kiếm

Search theo product name, code, slug, summary và ingredient keywords.

## Filter / Lọc

Category, brand, productStatus, stockStatus, createdAt, updatedAt, visibility.

## Sort / Sắp xếp

Default `updatedAt` desc; sort theo price, name, createdAt, updatedAt nếu API cho phép.

## Pagination / Phân trang

Default 20, max 100.

## Upload / Upload

Upload ảnh đi qua Admin Media; màn hình này attach media đã upload.

## Download / Download

Export sản phẩm qua export job.

## Loading State / Trạng thái tải

Table skeleton, form disabled khi submit, media attach loading.

## Empty State / Trạng thái rỗng

Chưa có sản phẩm hoặc không có kết quả theo filter; hiển thị action tạo mới nếu có quyền.

## Error State / Trạng thái lỗi

Validation error, slug conflict, product not found, permission denied.

## Success State / Trạng thái thành công

Product lưu thành công, status updated, import/export job created.

## Confirmation Dialog / Hộp xác nhận

Publish/archive/inactive product cần xác nhận.

## Toast Message / Toast

Tạo/sửa/đổi trạng thái/attach media/import/export thành công hoặc lỗi.

## Skeleton / Skeleton

Table skeleton giữ cột; detail skeleton giữ form groups.

## Responsive Behavior / Hành vi responsive

Desktop table-first; mobile chuyển sang compact list và form full-screen ở bước frontend sau.

## Accessibility / Khả năng tiếp cận

Form label rõ, status có text, action nguy hiểm có mô tả hậu quả.

## SEO Metadata / SEO metadata

Noindex vì là admin/private.

