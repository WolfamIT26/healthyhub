# Admin Orders Screen / Màn hình quản lý đơn hàng

## Screen Overview / Tổng quan màn hình

Admin Orders giúp staff/manager/admin xem, lọc, xử lý, xác nhận, hủy và theo dõi timeline đơn hàng.

## Business Goal / Mục tiêu kinh doanh

Xử lý đơn nhanh, giảm nhầm trạng thái và bảo toàn audit cho hành động vận hành.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/admin/orders` | Danh sách đơn hàng. |
| `/admin/orders/:orderId` | Chi tiết đơn hàng. |

## Permission / Phân quyền

Staff đọc/xử lý theo scope; manager/admin xử lý action nhạy cảm.

## Required API / API bắt buộc

- `GET /api/v1/admin/orders`.
- `GET /api/v1/admin/orders/{orderId}`.
- `PATCH /api/v1/admin/orders/{orderId}/status`.
- `POST /api/v1/admin/orders/{orderId}/cancel`.
- `POST /api/v1/admin/orders/{orderId}/confirm`.
- `GET /api/v1/admin/orders/{orderId}/timeline`.

## Required Data / Dữ liệu bắt buộc

Order summary/detail, item snapshot, customer summary, payment summary, shipping summary, timeline, status.

## UI Sections / Khu vực UI

Order table, filter/search, order detail panel, timeline, payment/shipping summary, action bar.

## Components / Thành phần

Admin Table, Status Badge, Order Detail, Timeline, Price Summary, Reason Dialog, Confirmation Dialog.

## Form / Form

Status action form với status mới và reason nếu cần.

## Validation / Validation

OrderId hợp lệ, status transition hợp lệ, reason required cho cancel/action nhạy cảm.

## Search / Tìm kiếm

Search theo order code, customer summary, recipient phone masked.

## Filter / Lọc

OrderStatus, paymentStatus, shippingStatus, createdAt, customerId admin only.

## Sort / Sắp xếp

Default `createdAt` desc.

## Pagination / Phân trang

Default 20, max 100.

## Upload / Upload

Không áp dụng.

## Download / Download

Invoice/export là future enhancement nếu API bổ sung.

## Loading State / Trạng thái tải

Table skeleton, detail skeleton, action button loading.

## Empty State / Trạng thái rỗng

Không có đơn hoặc không có đơn theo filter.

## Error State / Trạng thái lỗi

Cannot cancel, invalid status transition, already processed, permission denied.

## Success State / Trạng thái thành công

Status/timeline cập nhật và toast thành công.

## Confirmation Dialog / Hộp xác nhận

Confirm/cancel/status action quan trọng cần xác nhận và reason.

## Toast Message / Toast

Xác nhận đơn, hủy đơn, đổi trạng thái thành công hoặc lỗi.

## Skeleton / Skeleton

Table rows, detail header, timeline và summary skeleton.

## Responsive Behavior / Hành vi responsive

Desktop table-detail; mobile compact list và detail full-screen.

## Accessibility / Khả năng tiếp cận

Status có text, action nguy hiểm có mô tả hậu quả, timeline đọc được theo thứ tự.

## SEO Metadata / SEO metadata

Noindex vì admin/private.

