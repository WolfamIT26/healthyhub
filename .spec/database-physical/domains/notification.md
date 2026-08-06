# Notification Physical Database / Database vật lý domain thông báo

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `notification_requests` | Yêu cầu gửi thông báo. |
| `notification_templates` | Template theo channel. |
| `notification_recipients` | Người nhận từng request. |
| `notification_delivery_statuses` | Trạng thái gửi từng lần/kênh. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `notification_requests` | `template_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Template. |
| `notification_requests` | `notification_type` | `VARCHAR(32)` | No | None | account/order/security/marketing/system. |
| `notification_requests` | `channel_preference` | `VARCHAR(32)` | No | `email` | email/sms/zalo/push/in_app. |
| `notification_requests` | `delivery_context` | `JSON` | No | None | Reference metadata. |
| `notification_requests` | `request_status` | `VARCHAR(32)` | No | `queued` | queued/processing/sent/failed/cancelled. |
| `notification_requests` | `requested_at` | `DATETIME(3)` | No | Current time | Time. |
| `notification_templates` | `template_code` | `VARCHAR(100)` | No | None | Unique per tenant/channel. |
| `notification_templates` | `notification_channel` | `VARCHAR(32)` | No | None | email/sms/zalo/push/in_app. |
| `notification_templates` | `template_subject` | `VARCHAR(255)` | Yes | `NULL` | Subject. |
| `notification_templates` | `template_body_reference` | `VARCHAR(500)` | No | None | Body text/template reference. |
| `notification_templates` | `template_status` | `VARCHAR(32)` | No | `draft` | draft/active/inactive/archived. |
| `notification_templates` | `version` | `INT UNSIGNED` | No | `1` | Template versioning. |
| `notification_recipients` | `notification_request_id` | `BIGINT UNSIGNED` | No | None | FK Request. |
| `notification_recipients` | `recipient_type` | `VARCHAR(32)` | No | None | customer/user/staff/order. |
| `notification_recipients` | `recipient_reference_id` | `BIGINT UNSIGNED` | Yes | `NULL` | Reference in source domain. |
| `notification_recipients` | `recipient_contact_snapshot` | `VARCHAR(254)` | No | None | Email/phone snapshot. |
| `notification_recipients` | `recipient_status` | `VARCHAR(32)` | No | `pending` | pending/sent/failed/skipped. |
| `notification_delivery_statuses` | `notification_request_id` | `BIGINT UNSIGNED` | No | None | FK Request. |
| `notification_delivery_statuses` | `notification_recipient_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Recipient. |
| `notification_delivery_statuses` | `channel` | `VARCHAR(32)` | No | None | channel. |
| `notification_delivery_statuses` | `delivery_status` | `VARCHAR(32)` | No | `pending` | pending/success/failed/retried. |
| `notification_delivery_statuses` | `provider_reference` | `VARCHAR(191)` | Yes | `NULL` | Provider ref only. |
| `notification_delivery_statuses` | `failure_reason` | `VARCHAR(500)` | Yes | `NULL` | Required when failed. |
| `notification_delivery_statuses` | `attempted_at` | `DATETIME(3)` | No | Current time | Attempt time. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `notification_requests` | `id` | `template_id` | None | `request_status` allowed | `idx_notification_requests_type_status_time`, `idx_notification_requests_template` |
| `notification_templates` | `id` | None | `(tenant_id, template_code, notification_channel, version)` | `template_status` allowed | `idx_notification_templates_channel_status`, `ft_notification_templates_subject_body` |
| `notification_recipients` | `id` | `notification_request_id` | `(tenant_id, notification_request_id, recipient_type, recipient_reference_id)` | contact snapshot required | `idx_notification_recipients_request_status`, `idx_notification_recipients_contact` |
| `notification_delivery_statuses` | `id` | `notification_request_id`, `notification_recipient_id` | None | `delivery_status` allowed | `idx_notification_delivery_status_time`, `idx_notification_delivery_provider` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: `template_subject`, `template_body_reference` nếu cần tìm template.
- Generated Column: Không dùng ở MVP.

## FK Delete Rule / Quy tắc xóa FK

- Template -> request: Restrict nếu đã dùng.
- Request -> recipient/delivery: Restrict.
- Recipient reference là cross-domain reference nên không FK vật lý tới domain nguồn.

## Performance & Retention / Hiệu năng và lưu giữ

- Send log giữ đủ để audit delivery và retry.
- Marketing/bulk notification history có thể archive theo thời gian sau retention.
