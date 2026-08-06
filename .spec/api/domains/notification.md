# Notification API Specification / Đặc tả API thông báo

## API Overview / Tổng quan API

Notification API quản lý thông báo in-app, trạng thái đọc, chiến dịch gửi thông báo, template và webhook delivery status từ provider email/SMS/Zalo/push tương lai.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/me/notifications` | Danh sách thông báo của tôi | Customer JWT | Owner |
| PATCH | `/api/v1/me/notifications/{notificationId}/read` | Đánh dấu đã đọc | Customer JWT | Owner |
| PATCH | `/api/v1/me/notifications/read-all` | Đánh dấu tất cả đã đọc | Customer JWT | Owner |
| GET | `/api/v1/admin/notifications` | Danh sách notification admin | Staff/Manager JWT | `notifications:read` |
| POST | `/api/v1/admin/notifications/send` | Gửi notification/campaign | Manager/Admin JWT | `notifications:send` |
| GET | `/api/v1/admin/notifications/{notificationId}` | Chi tiết notification admin | Staff/Manager JWT | `notifications:read` |
| GET | `/api/v1/admin/notifications/templates` | Danh sách template | Staff/Manager JWT | `notifications:read` |
| POST | `/api/v1/admin/notifications/templates` | Tạo template | Manager/Admin JWT | `notifications:manage` |
| PATCH | `/api/v1/admin/notifications/templates/{templateId}` | Cập nhật template | Manager/Admin JWT | `notifications:manage` |
| POST | `/api/v1/webhooks/notification/{provider}` | Nhận delivery webhook | Provider auth | Provider scope |

## REST Resource / Tài nguyên REST

- Primary resources: `notifications`, `templates`.
- Action resources: `read`, `read-all`, `send`.
- Webhook resource: `webhooks/notification/{provider}`.

## HTTP Method / Phương thức HTTP

- GET cho list/detail/templates.
- POST cho send/create template/webhook.
- PATCH cho read/update template.

## URI Convention / Quy ước URI

- Customer namespace: `/api/v1/me/notifications`.
- Admin namespace: `/api/v1/admin/notifications`.
- Webhook namespace: `/api/v1/webhooks/notification/{provider}`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- Customer chỉ xem notification của mình.
- Manager/Admin gửi notification và quản lý template.
- Provider webhook dùng provider auth.

## Authentication / Xác thực

- Customer JWT cho `/me`.
- Staff JWT cho admin.
- Provider signature/API key cho webhook.

## Authorization / Phân quyền

- Không lộ nội dung cá nhân ngoài người nhận.
- Campaign send cần scope và audit.
- Template chứa nội dung nhạy cảm cần quyền manage.

## Request Contract / Contract request

- Read/read-all dùng action request.
- Send request có channel, recipient scope, templateId/content, schedule nếu có và idempotency key.
- Template create/update dùng command input.
- Webhook có provider event ID.

## Response Contract / Contract response

- Notification summary/detail.
- Delivery status summary.
- Template summary.
- Send response có job/campaign status nếu bất đồng bộ.

## Error Contract / Contract lỗi

- `BUSINESS.NOTIFICATION.OPT_OUT`
- `INTEGRATION.NOTIFICATION.PROVIDER_ERROR`
- `BUSINESS.NOTIFICATION.TEMPLATE_INVALID`
- `PERMISSION.COMMON.FORBIDDEN`

## Validation Rule / Quy tắc validation

- Channel thuộc danh sách cho phép.
- Recipient scope hợp lệ và được phép.
- Template variables đủ dữ liệu.
- Provider webhook signature hợp lệ khi triển khai.

## Business Rule / Quy tắc nghiệp vụ

- Tôn trọng opt-in/opt-out của customer.
- Notification liên quan order/account cần ưu tiên tính đúng và audit.
- Campaign marketing cần người có quyền duyệt.

## Pagination / Phân trang

- Customer notification list default 20, max 100.
- Admin list default 20, max 100.

## Filter / Lọc

- Lọc theo channel, notificationStatus, createdAt, read status, recipient type.

## Search / Tìm kiếm

- Admin search theo title, template name, campaign name.

## Sort / Sắp xếp

- Default sort: `createdAt` desc.

## Upload / Upload

Không áp dụng trực tiếp. Attachment/media nếu có đi qua Media API.

## Download / Download

Export delivery report nếu có dùng export contract.

## Rate Limit / Giới hạn gọi API

- Customer read: Authenticated Normal.
- Send campaign: Strict hoặc Cost Strict.
- Webhook: Provider Strict.

## Idempotency / Chống gửi lặp

- Send notification/campaign bắt buộc idempotency key.
- Read/read-all idempotent.
- Webhook dedupe bằng provider event ID.

## Webhook / Webhook

- URI pattern: `/api/v1/webhooks/notification/{provider}`.
- Webhook cập nhật delivery status sau khi verify provider.

## AI Endpoint / Endpoint AI

AI email/caption generator thuộc AI API. Notification API chỉ gửi nội dung đã được duyệt.

