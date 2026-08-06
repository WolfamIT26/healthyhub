# Customer Notifications Screen / Màn hình thông báo khách hàng

## Screen Overview / Tổng quan màn hình

Màn hình thông báo hiển thị notification in-app của customer và cho phép đánh dấu đã đọc.

## Business Goal / Mục tiêu kinh doanh

Giúp khách theo dõi trạng thái đơn, tài khoản, ưu đãi và chăm sóc sau mua.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/account/notifications` | Thông báo của tôi. |

## Permission / Phân quyền

Customer/member/VIP, owner only.

## Required API / API bắt buộc

- `GET /api/v1/me/notifications`.
- `PATCH /api/v1/me/notifications/{notificationId}/read`.
- `PATCH /api/v1/me/notifications/read-all`.

## Required Data / Dữ liệu bắt buộc

Notification summary list, read status, channel, createdAt, pagination metadata.

## UI Sections / Khu vực UI

Notification list, filter tabs, read all action, pagination.

## Components / Thành phần

Notification Item, Status Badge, Filter Tabs, Pagination, Empty State.

## Form / Form

Không có form chính.

## Validation / Validation

NotificationId hợp lệ và owner check.

## Search / Tìm kiếm

Không ưu tiên ở customer view.

## Filter / Lọc

Lọc theo read status hoặc channel nếu API hỗ trợ.

## Sort / Sắp xếp

Default `createdAt` desc.

## Pagination / Phân trang

Default 20, max 100.

## Upload / Upload

Không áp dụng.

## Download / Download

Không áp dụng.

## Loading State / Trạng thái tải

Skeleton notification list.

## Empty State / Trạng thái rỗng

Chưa có thông báo.

## Error State / Trạng thái lỗi

Load failed, owner required, session expired.

## Success State / Trạng thái thành công

Mark read/read all cập nhật trạng thái.

## Confirmation Dialog / Hộp xác nhận

Không áp dụng cho read action.

## Toast Message / Toast

Đánh dấu đã đọc hoặc lỗi cập nhật.

## Skeleton / Skeleton

Skeleton notification rows.

## Responsive Behavior / Hành vi responsive

Mobile list một cột, action read all rõ nhưng không che nội dung.

## Accessibility / Khả năng tiếp cận

Unread/read status có text, item có label và timestamp dễ đọc.

## SEO Metadata / SEO metadata

Noindex vì là dữ liệu cá nhân.

