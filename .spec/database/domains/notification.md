# Notification Database / Database domain thông báo

## Storage Purpose / Mục đích lưu trữ

Lưu yêu cầu gửi thông báo, template, người nhận và trạng thái gửi trên các kênh email, SMS, Zalo, push và in-app future.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `notification_requests` | Yêu cầu gửi thông báo theo nghiệp vụ. |
| `notification_templates` | Template nội dung thông báo. |
| `notification_recipients` | Người nhận của một request. |
| `notification_delivery_statuses` | Trạng thái gửi theo kênh/lần thử. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `notification_requests` | `id` | `tenant_id`, `notification_type`, `channel_preference`, `delivery_context`, `request_status`, `requested_at` | `template_id` -> NotificationTemplate nullable | queued, processing, sent, failed, cancelled |
| `notification_templates` | `id` | `tenant_id`, `template_code`, `notification_channel`, `template_subject`, `template_body_reference`, `template_status`, `version` | None | draft, active, inactive, archived |
| `notification_recipients` | `id` | `tenant_id`, `recipient_type`, `recipient_reference_id`, `recipient_contact_snapshot`, `recipient_status` | `notification_request_id` | pending, sent, failed, skipped |
| `notification_delivery_statuses` | `id` | `tenant_id`, `channel`, `delivery_status`, `provider_reference`, `failure_reason`, `attempted_at` | `notification_request_id`, `notification_recipient_id` nullable | pending, success, failed, retried |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Không có 1-1 bắt buộc.
- 1-N: Một template có nhiều request; một request có nhiều recipient và delivery status.
- N-N: Request và recipient target có thể liên kết nhiều domain qua `recipient_type`/`recipient_reference_id`.
- Cardinality: Marketing notification phải kiểm tra opt-in trước khi tạo recipient active.

## Business Constraints / Ràng buộc nghiệp vụ

- Thông báo tài khoản/đơn hàng/bảo mật ưu tiên hơn marketing.
- Marketing notification phải tôn trọng opt-in.
- Nội dung gửi phải rõ và không chứa secret.

## Delete Strategy / Chiến lược xóa

- Template dùng inactive/archive thay vì hard delete nếu đã dùng.
- Delivery status giữ log trong retention.
- Request failed/cancelled không xóa ngay để phục vụ audit.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Template cần `version`; delivery cần `attempted_at`, `failure_reason`.

## Data Lifecycle / Vòng đời dữ liệu

Template draft/active, request queued, xử lý qua channel, recipient sent/failed/skipped, delivery status lưu kết quả.

## Data Ownership / Sở hữu dữ liệu

Notification domain sở hữu request/template/delivery. Customer/User/Order/Promotion chỉ là context hoặc người nhận.

## Data Validation / Validation dữ liệu

- `template_code` unique theo tenant/channel.
- `recipient_contact_snapshot` phải đủ cho kênh gửi.
- Marketing request cần consent/opt-in.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `notification_type` | `notification_requests` | Loại thông báo. | account, order, security, marketing, system. |
| `channel_preference` | `notification_requests` | Kênh ưu tiên. | email, sms, zalo, push, in_app. |
| `template_code` | `notification_templates` | Mã template. | Unique theo tenant/channel. |
| `recipient_reference_id` | `notification_recipients` | ID người nhận ở domain nguồn. | Bắt buộc nếu không phải contact one-off. |
| `delivery_status` | `notification_delivery_statuses` | Kết quả gửi. | pending, success, failed, retried. |
