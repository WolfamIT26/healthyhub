# User Database / Database domain người dùng

## Storage Purpose / Mục đích lưu trữ

Lưu tài khoản, vai trò, quyền và lịch sử trạng thái để kiểm soát truy cập trong toàn hệ thống.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `user_accounts` | Tài khoản đăng nhập chung cho customer, staff, manager, admin. |
| `roles` | Vai trò hệ thống. |
| `permissions` | Quyền hành động hoặc phạm vi dữ liệu. |
| `role_permissions` | Gán quyền cho vai trò. |
| `user_role_assignments` | Gán vai trò cho user. |
| `permission_grants` | Quyền cấp riêng ngoài role. |
| `user_status_histories` | Lịch sử thay đổi trạng thái user. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `user_accounts` | `id` | `tenant_id`, `email`, `phone`, `display_name`, `password_reference`, `user_status`, `last_login_at` | None | active, pending, locked, disabled |
| `roles` | `id` | `tenant_id`, `role_code`, `role_name`, `role_scope`, `role_status` | None | active, inactive |
| `permissions` | `id` | `permission_code`, `permission_scope`, `permission_level`, `permission_status` | None | active, inactive |
| `role_permissions` | `id` | `tenant_id`, `assigned_at`, `assignment_status` | `role_id`, `permission_id` | active, revoked |
| `user_role_assignments` | `id` | `tenant_id`, `assigned_at`, `expires_at`, `assignment_status` | `user_account_id`, `role_id` | active, expired, revoked |
| `permission_grants` | `id` | `tenant_id`, `grant_scope`, `granted_at`, `expires_at`, `grant_status` | `user_account_id`, `permission_id` | active, expired, revoked |
| `user_status_histories` | `id` | `tenant_id`, `from_status`, `to_status`, `reason`, `changed_at` | `user_account_id`, `changed_by` -> User | recorded |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Một `user_account` có thể gắn 0-1 `customer_profile` và 0-1 `staff_profile`.
- 1-N: Một `user_account` có nhiều `user_status_histories`.
- N-N: User và Role qua `user_role_assignments`; Role và Permission qua `role_permissions`.
- Cardinality: Một user phải có ít nhất một role để vào khu vực cần phân quyền.

## Business Constraints / Ràng buộc nghiệp vụ

- Không cấp quyền vượt role/scope được phép.
- Thay đổi role/permission quan trọng phải có lịch sử.
- Super Admin là phạm vi platform tương lai, không dùng lẫn với admin cửa hàng.

## Delete Strategy / Chiến lược xóa

- `user_accounts`: soft delete hoặc disabled, không hard delete nếu còn order/audit.
- Role/permission dùng inactive thay vì hard delete.
- Assignment có thể revoked, không xóa lịch sử phân quyền.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn cho user, role, permission, assignment và grant. Các thay đổi nhạy cảm cần `changed_by` và `reason`.

## Data Lifecycle / Vòng đời dữ liệu

User tạo ở pending/active, có thể locked/disabled. Role và permission được cấu hình, gán, thu hồi hoặc hết hạn.

## Data Ownership / Sở hữu dữ liệu

User domain sở hữu tài khoản và quyền. Customer/Staff chỉ sở hữu hồ sơ nghiệp vụ gắn với tài khoản.

## Data Validation / Validation dữ liệu

- `email` hoặc `phone` cần unique theo tenant khi dùng làm identifier.
- `role_code` và `permission_code` không trùng trong cùng scope.
- `expires_at` phải sau `assigned_at` hoặc `granted_at` nếu có.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `email` | `user_accounts` | Email đăng nhập/xác minh. | Định dạng email, unique theo tenant nếu active. |
| `password_reference` | `user_accounts` | Tham chiếu mật khẩu đã bảo vệ. | Không lưu plain text. |
| `role_code` | `roles` | Mã vai trò. | English, stable, unique theo scope. |
| `permission_code` | `permissions` | Mã quyền. | English, stable, unique. |
| `assignment_status` | Role/permission links | Trạng thái gán quyền. | active, expired, revoked. |
