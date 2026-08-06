# Settings Database / Database domain cấu hình

## Storage Purpose / Mục đích lưu trữ

Lưu cấu hình cửa hàng, cấu hình tenant tương lai, yêu cầu thay đổi cấu hình và giá trị policy dùng bởi payment, shipping, notification, AI và security.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `tenant_setting_profiles` | Hồ sơ cấu hình theo tenant/cửa hàng tương lai. |
| `store_settings` | Nhóm cấu hình chính của cửa hàng. |
| `setting_entries` | Giá trị cấu hình cụ thể. |
| `setting_change_requests` | Yêu cầu thay đổi cấu hình quan trọng. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `tenant_setting_profiles` | `id` | `tenant_id`, `tenant_mode`, `profile_status`, `effective_from`, `effective_to` | None | active, inactive, archived |
| `store_settings` | `id` | `tenant_id`, `configuration_area`, `setting_status`, `version` | `tenant_setting_profile_id` | active, inactive |
| `setting_entries` | `id` | `tenant_id`, `setting_key`, `setting_value`, `configuration_scope`, `is_sensitive`, `effective_from` | `store_setting_id` | active, inactive, expired |
| `setting_change_requests` | `id` | `tenant_id`, `change_reason`, `change_status`, `requested_at`, `approved_at` | `store_setting_id`, `requested_by` -> User, `approved_by` -> User nullable | requested, approved, rejected, applied |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Một tenant active nên có một `tenant_setting_profile` active.
- 1-N: Một profile có nhiều `store_settings`; một store setting có nhiều entries và change requests.
- N-N: Không có quan hệ N-N trực tiếp.
- Cardinality: Setting entry thuộc một setting area rõ ràng.

## Business Constraints / Ràng buộc nghiệp vụ

- Chỉ admin hoặc role được cấp quyền mới thay đổi cấu hình quan trọng.
- Thay đổi liên quan security, payment, shipping hoặc AI cần audit và approval.
- Sensitive setting không được hiển thị hoặc đưa vào prompt AI.

## Delete Strategy / Chiến lược xóa

- Setting dùng inactive/expired hoặc versioning, không hard delete cấu hình đã từng áp dụng.
- Change request giữ lịch sử audit.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Với `setting_change_requests` cần `requested_by`, `approved_by`, `change_reason` và `version`.

## Data Lifecycle / Vòng đời dữ liệu

Cấu hình được tạo, active, thay đổi qua request nếu nhạy cảm, áp dụng theo thời gian hiệu lực, sau đó inactive/expired khi thay thế.

## Data Ownership / Sở hữu dữ liệu

Settings domain sở hữu policy/cấu hình. Domain khác chỉ đọc cấu hình theo contract.

## Data Validation / Validation dữ liệu

- `setting_key` unique trong `configuration_scope` và `tenant_id`.
- `setting_value` phải đúng kiểu logic được định nghĩa bởi setting key.
- Sensitive setting phải bị che trong log/report/prompt.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `tenant_id` | All | Cửa hàng/tenant sở hữu cấu hình. | Bắt buộc với cấu hình tenant. |
| `configuration_area` | `store_settings` | Nhóm cấu hình. | Security, Payment, Shipping, Notification, AI, SEO. |
| `setting_key` | `setting_entries` | Khóa cấu hình. | English, stable, unique theo scope. |
| `setting_value` | `setting_entries` | Giá trị cấu hình logic. | Không lộ secret; validate theo key. |
| `change_status` | `setting_change_requests` | Trạng thái yêu cầu thay đổi. | requested, approved, rejected, applied. |
