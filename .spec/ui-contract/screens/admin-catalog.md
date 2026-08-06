# Admin Catalog Screen / Màn hình quản lý danh mục và thương hiệu

## Screen Overview / Tổng quan màn hình

Admin Catalog quản lý category tree, category detail, brand list và brand detail.

## Business Goal / Mục tiêu kinh doanh

Giữ cấu trúc phân loại sản phẩm rõ ràng để khách dễ tìm và admin dễ vận hành.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/admin/catalog` | Quản lý category và brand. |
| `/admin/categories` | Quản lý danh mục nếu tách route. |
| `/admin/brands` | Quản lý thương hiệu nếu tách route. |

## Permission / Phân quyền

Staff đọc; manager/admin quản lý.

## Required API / API bắt buộc

- `GET /api/v1/admin/categories`.
- `POST /api/v1/admin/categories`.
- `PATCH /api/v1/admin/categories/{categoryId}`.
- `PATCH /api/v1/admin/categories/{categoryId}/status`.
- `PATCH /api/v1/admin/categories/reorder`.
- `GET /api/v1/admin/brands`.
- `POST /api/v1/admin/brands`.
- `PATCH /api/v1/admin/brands/{brandId}`.
- `PATCH /api/v1/admin/brands/{brandId}/status`.
- `POST /api/v1/admin/brands/{brandId}/media`.

## Required Data / Dữ liệu bắt buộc

Category tree/list, brand list/detail, status, product count, media logo summary.

## UI Sections / Khu vực UI

Category tree, category form, brand table, brand form, reorder action, logo attach.

## Components / Thành phần

Tree List, Admin Table, Category Form, Brand Form, Media Picker, Confirmation Dialog.

## Form / Form

Category/brand name, slug, parent category, description, status, display order.

## Validation / Validation

Name/slug required, unique slug, no category cycle, valid media reference.

## Search / Tìm kiếm

Search category/brand theo name và slug.

## Filter / Lọc

Status, parentId, visibility, createdAt/updatedAt.

## Sort / Sắp xếp

Category theo displayOrder; brand theo name hoặc updatedAt.

## Pagination / Phân trang

Brand/admin list phân trang; category tree có thể không phân trang nếu nhỏ.

## Upload / Upload

Logo upload đi qua Admin Media, màn hình chỉ attach.

## Download / Download

Không áp dụng.

## Loading State / Trạng thái tải

Skeleton tree và table.

## Empty State / Trạng thái rỗng

Chưa có category/brand, hiển thị tạo mới nếu có quyền.

## Error State / Trạng thái lỗi

Slug conflict, has active products, invalid parent, permission denied.

## Success State / Trạng thái thành công

Category/brand lưu hoặc reorder thành công.

## Confirmation Dialog / Hộp xác nhận

Archive/inactive category hoặc brand cần xác nhận nếu có active products.

## Toast Message / Toast

Tạo/sửa/reorder/status thành công hoặc lỗi.

## Skeleton / Skeleton

Skeleton tree nodes và table rows.

## Responsive Behavior / Hành vi responsive

Desktop chia tree/table và form; mobile dùng tab hoặc drill-down ở bước frontend sau.

## Accessibility / Khả năng tiếp cận

Tree item có label, reorder có mô tả, status không chỉ dùng màu.

## SEO Metadata / SEO metadata

Noindex vì là admin/private.

