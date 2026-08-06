# Admin Inventory Screen / Màn hình quản lý tồn kho

## Screen Overview / Tổng quan màn hình

Admin Inventory hiển thị tồn kho, cảnh báo, movement và điều chỉnh tồn kho.

## Business Goal / Mục tiêu kinh doanh

Tránh bán vượt tồn, phát hiện sắp hết hàng và ghi nhận điều chỉnh rõ lý do.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/admin/inventory` | Tồn kho và cảnh báo. |
| `/admin/inventory/:productId` | Tồn kho theo sản phẩm nếu cần. |

## Permission / Phân quyền

Staff đọc/limited adjust; manager/admin điều chỉnh.

## Required API / API bắt buộc

- `GET /api/v1/admin/inventory`.
- `GET /api/v1/admin/inventory/{productId}`.
- `POST /api/v1/admin/inventory/adjustments`.
- `GET /api/v1/admin/inventory/movements`.
- `GET /api/v1/admin/inventory/alerts`.
- `POST /api/v1/admin/inventory/exports`.

## Required Data / Dữ liệu bắt buộc

Inventory summary, product summary, stock status, available/reserved quantity, movement summary, alert list.

## UI Sections / Khu vực UI

Inventory table, alert panel, movement history, adjustment form, export action.

## Components / Thành phần

Admin Table, Alert List, Movement Timeline/List, Adjustment Form, Reason Dialog, Export Action.

## Form / Form

Adjustment form gồm product, movement type, quantity và reason.

## Validation / Validation

Quantity hợp lệ, movement type hợp lệ, product exists, reason required.

## Search / Tìm kiếm

Search theo product name/code.

## Filter / Lọc

ProductId, stockStatus, movementType, createdAt, lowStock flag.

## Sort / Sắp xếp

Cảnh báo trước, sau đó `updatedAt` desc.

## Pagination / Phân trang

Inventory default 20/max 100; movement default 50/max 200.

## Upload / Upload

Import tồn kho là future enhancement, chưa là màn hình bắt buộc.

## Download / Download

Export tồn kho qua export job.

## Loading State / Trạng thái tải

Table skeleton, alert skeleton, form disabled khi submit.

## Empty State / Trạng thái rỗng

Không có cảnh báo hoặc chưa có dữ liệu tồn kho.

## Error State / Trạng thái lỗi

Insufficient stock, invalid adjustment, version conflict, permission denied.

## Success State / Trạng thái thành công

Adjustment ghi nhận, stock summary và movement list cập nhật.

## Confirmation Dialog / Hộp xác nhận

Điều chỉnh tồn kho bắt buộc xác nhận và reason.

## Toast Message / Toast

Adjustment/export thành công hoặc lỗi.

## Skeleton / Skeleton

Table rows và movement rows skeleton.

## Responsive Behavior / Hành vi responsive

Desktop table-first; mobile compact list với action riêng.

## Accessibility / Khả năng tiếp cận

Stock status có text, adjustment form label rõ, warning không chỉ dùng màu.

## SEO Metadata / SEO metadata

Noindex vì admin/private.

