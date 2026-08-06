# Admin Notifications Screen / Màn hình quản lý thông báo

## Screen Overview / Tổng quan màn hình

Admin Notifications quản lý notification, template, send campaign và delivery status.

## Business Goal / Mục tiêu kinh doanh

Gửi thông báo đúng người, đúng kênh, tôn trọng opt-in/opt-out và theo dõi kết quả gửi.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/admin/notifications` | Quản lý notification và template. |

## Permission / Phân quyền

Staff đọc; manager/admin gửi và quản lý template.

## Required API / API bắt buộc

- `GET /api/v1/admin/notifications`.
- `POST /api/v1/admin/notifications/send`.
- `GET /api/v1/admin/notifications/{notificationId}`.
- `GET /api/v1/admin/notifications/templates`.
- `POST /api/v1/admin/notifications/templates`.
- `PATCH /api/v1/admin/notifications/templates/{templateId}`.

## Required Data / Dữ liệu bắt buộc

Notification list/detail, delivery status, template list/detail, channel, recipient scope.

## UI Sections / Khu vực UI

Notification table, template table/form, send form, delivery detail, recipient scope summary.

## Components / Thành phần

Admin Table, Template Form, Send Notification Form, Delivery Status, Confirmation Dialog.

## Form / Form

Template create/update và send campaign/action form.

## Validation / Validation

Channel hợp lệ, template variables đủ, recipient scope hợp lệ, content length, schedule nếu có.

## Search / Tìm kiếm

Search theo title, template name, campaign name.

## Filter / Lọc

Channel, notificationStatus, createdAt, recipient type.

## Sort / Sắp xếp

Default `createdAt` desc.

## Pagination / Phân trang

Default 20, max 100.

## Upload / Upload

Attachment/media nếu có đi qua Admin Media, chưa bắt buộc.

## Download / Download

Export delivery report nếu có quyền.

## Loading State / Trạng thái tải

Table skeleton, send action loading, template form disabled khi submit.

## Empty State / Trạng thái rỗng

Chưa có notification/template.

## Error State / Trạng thái lỗi

Opt-out, provider error, template invalid, permission denied.

## Success State / Trạng thái thành công

Template saved, notification send job created, status updated.

## Confirmation Dialog / Hộp xác nhận

Gửi notification/campaign hàng loạt bắt buộc xác nhận.

## Toast Message / Toast

Gửi thông báo, lưu template, export thành công hoặc lỗi.

## Skeleton / Skeleton

Table rows và form skeleton.

## Responsive Behavior / Hành vi responsive

Desktop tabs/list-detail; mobile compact list và form full-screen.

## Accessibility / Khả năng tiếp cận

Channel/status có text, send confirmation nêu rõ phạm vi người nhận.

## SEO Metadata / SEO metadata

Noindex vì admin/private.

