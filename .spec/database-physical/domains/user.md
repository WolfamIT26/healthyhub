# User Physical Database / Database vật lý domain người dùng

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `user_accounts` | Tài khoản đăng nhập chung. |
| `roles` | Vai trò theo tenant/scope. |
| `permissions` | Quyền hệ thống. |
| `role_permissions` | Gán permission cho role. |
| `user_role_assignments` | Gán role cho user. |
| `permission_grants` | Quyền cấp riêng cho user. |
| `user_status_histories` | Lịch sử trạng thái user. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL` trừ `permissions` global có thể nullable theo ADR sau, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `user_accounts` | `email` | `VARCHAR(254)` | Yes | `NULL` | Unique active theo tenant. |
| `user_accounts` | `phone` | `VARCHAR(32)` | Yes | `NULL` | Unique active theo tenant nếu dùng. |
| `user_accounts` | `display_name` | `VARCHAR(255)` | No | None | Tên hiển thị. |
| `user_accounts` | `password_reference` | `VARCHAR(191)` | No | None | Hash/reference, không plain text. |
| `user_accounts` | `user_status` | `VARCHAR(32)` | No | `pending` | pending, active, locked, disabled. |
| `user_accounts` | `last_login_at` | `DATETIME(3)` | Yes | `NULL` | Theo dõi truy cập. |
| `roles` | `role_code` | `VARCHAR(64)` | No | None | Unique theo tenant/scope. |
| `roles` | `role_name` | `VARCHAR(150)` | No | None | Tên role. |
| `roles` | `role_scope` | `VARCHAR(64)` | No | `tenant` | tenant, platform. |
| `roles` | `role_status` | `VARCHAR(32)` | No | `active` | active, inactive. |
| `permissions` | `permission_code` | `VARCHAR(100)` | No | None | Unique. |
| `permissions` | `permission_scope` | `VARCHAR(64)` | No | `tenant` | tenant, platform. |
| `permissions` | `permission_level` | `VARCHAR(32)` | No | `read` | read/write/manage. |
| `permissions` | `permission_status` | `VARCHAR(32)` | No | `active` | active, inactive. |
| `role_permissions` | `role_id` | `BIGINT UNSIGNED` | No | None | FK. |
| `role_permissions` | `permission_id` | `BIGINT UNSIGNED` | No | None | FK. |
| `role_permissions` | `assigned_at` | `DATETIME(3)` | No | Current time | Audit nghiệp vụ. |
| `role_permissions` | `assignment_status` | `VARCHAR(32)` | No | `active` | active, revoked. |
| `user_role_assignments` | `user_account_id` | `BIGINT UNSIGNED` | No | None | FK. |
| `user_role_assignments` | `role_id` | `BIGINT UNSIGNED` | No | None | FK. |
| `user_role_assignments` | `assigned_at` | `DATETIME(3)` | No | Current time | Lifecycle. |
| `user_role_assignments` | `expires_at` | `DATETIME(3)` | Yes | `NULL` | Optional expiry. |
| `user_role_assignments` | `assignment_status` | `VARCHAR(32)` | No | `active` | active, expired, revoked. |
| `permission_grants` | `user_account_id` | `BIGINT UNSIGNED` | No | None | FK. |
| `permission_grants` | `permission_id` | `BIGINT UNSIGNED` | No | None | FK. |
| `permission_grants` | `grant_scope` | `VARCHAR(64)` | No | `tenant` | Scope. |
| `permission_grants` | `granted_at` | `DATETIME(3)` | No | Current time | Lifecycle. |
| `permission_grants` | `expires_at` | `DATETIME(3)` | Yes | `NULL` | Optional expiry. |
| `permission_grants` | `grant_status` | `VARCHAR(32)` | No | `active` | active, expired, revoked. |
| `user_status_histories` | `user_account_id` | `BIGINT UNSIGNED` | No | None | FK. |
| `user_status_histories` | `from_status` | `VARCHAR(32)` | Yes | `NULL` | Previous status. |
| `user_status_histories` | `to_status` | `VARCHAR(32)` | No | None | New status. |
| `user_status_histories` | `reason` | `VARCHAR(500)` | Yes | `NULL` | Required for lock/disable. |
| `user_status_histories` | `changed_at` | `DATETIME(3)` | No | Current time | Audit. |
| `user_status_histories` | `changed_by` | `BIGINT UNSIGNED` | Yes | `NULL` | FK User. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `user_accounts` | `id` | Audit actor FKs to `user_accounts.id` | `(tenant_id, email)`, `(tenant_id, phone)` | Email hoặc phone phải có ít nhất một | `idx_user_accounts_tenant_status`, `idx_user_accounts_last_login` |
| `roles` | `id` | None | `(tenant_id, role_code)` | `role_scope/status` allowed | `idx_roles_tenant_status` |
| `permissions` | `id` | None | `permission_code` | `permission_level/status` allowed | `idx_permissions_scope_status` |
| `role_permissions` | `id` | `role_id`, `permission_id` | `(tenant_id, role_id, permission_id)` | `assignment_status` allowed | `idx_role_permissions_permission` |
| `user_role_assignments` | `id` | `user_account_id`, `role_id` | `(tenant_id, user_account_id, role_id, assignment_status)` | `expires_at` null hoặc sau `assigned_at` | `idx_user_roles_user_status` |
| `permission_grants` | `id` | `user_account_id`, `permission_id` | `(tenant_id, user_account_id, permission_id, grant_status)` | `expires_at` null hoặc sau `granted_at` | `idx_permission_grants_user_status` |
| `user_status_histories` | `id` | `user_account_id`, `changed_by` | None | `to_status` allowed | `idx_user_status_histories_user_time` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: Không dùng.
- Generated Column: Không dùng ở MVP.

## FK Delete Rule / Quy tắc xóa FK

- Role/permission assignment: Restrict khi còn active.
- `changed_by`, audit actor columns: Set Null.
- User account: không hard delete nếu còn customer/staff/order/audit.

## Performance & Retention / Hiệu năng và lưu giữ

- Index chính phục vụ login bằng email/phone và quản trị user theo status.
- History giữ dài hạn cho audit phân quyền; có thể archive theo `changed_at` khi lớn.
