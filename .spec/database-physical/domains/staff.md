# Staff Physical Database / Database vật lý domain nhân sự

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `staff_profiles` | Hồ sơ nhân sự vận hành. |
| `staff_assignments` | Phân công phạm vi công việc. |
| `operational_permissions` | Quyền vận hành chi tiết. |
| `staff_activities` | Nhật ký thao tác của staff. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `staff_profiles` | `user_account_id` | `BIGINT UNSIGNED` | No | None | FK User. |
| `staff_profiles` | `staff_code` | `VARCHAR(64)` | No | None | Unique theo tenant. |
| `staff_profiles` | `staff_status` | `VARCHAR(32)` | No | `active` | active, suspended, left. |
| `staff_profiles` | `work_scope` | `VARCHAR(64)` | No | `operations` | Phạm vi. |
| `staff_profiles` | `assigned_role` | `VARCHAR(64)` | No | `staff` | Vai trò nghiệp vụ. |
| `staff_assignments` | `staff_profile_id` | `BIGINT UNSIGNED` | No | None | FK Staff. |
| `staff_assignments` | `assignment_scope` | `VARCHAR(64)` | No | None | order, inventory, customer. |
| `staff_assignments` | `assigned_at` | `DATETIME(3)` | No | Current time | Lifecycle. |
| `staff_assignments` | `expires_at` | `DATETIME(3)` | Yes | `NULL` | Optional. |
| `staff_assignments` | `assignment_status` | `VARCHAR(32)` | No | `active` | active, expired, revoked. |
| `staff_assignments` | `assigned_by` | `BIGINT UNSIGNED` | Yes | `NULL` | FK User actor. |
| `operational_permissions` | `staff_profile_id` | `BIGINT UNSIGNED` | No | None | FK Staff. |
| `operational_permissions` | `permission_area` | `VARCHAR(64)` | No | None | order, inventory, customer. |
| `operational_permissions` | `permission_level` | `VARCHAR(32)` | No | `read` | read, write, manage. |
| `operational_permissions` | `permission_status` | `VARCHAR(32)` | No | `active` | active, inactive. |
| `staff_activities` | `staff_profile_id` | `BIGINT UNSIGNED` | No | None | FK Staff. |
| `staff_activities` | `activity_type` | `VARCHAR(64)` | No | None | update_order, adjust_stock. |
| `staff_activities` | `target_domain` | `VARCHAR(64)` | No | None | Domain affected. |
| `staff_activities` | `target_reference_id` | `BIGINT UNSIGNED` | No | None | ID logic target. |
| `staff_activities` | `activity_note` | `VARCHAR(500)` | Yes | `NULL` | Required for sensitive action. |
| `staff_activities` | `activity_at` | `DATETIME(3)` | No | Current time | Audit. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `staff_profiles` | `id` | `user_account_id` -> `user_accounts.id` | `(tenant_id, staff_code)`, `(tenant_id, user_account_id)` | `staff_status` allowed | `idx_staff_profiles_status` |
| `staff_assignments` | `id` | `staff_profile_id`, `assigned_by` | `(tenant_id, staff_profile_id, assignment_scope, assignment_status)` | `expires_at` null hoặc sau `assigned_at` | `idx_staff_assignments_scope_status` |
| `operational_permissions` | `id` | `staff_profile_id` | `(tenant_id, staff_profile_id, permission_area)` | `permission_level/status` allowed | `idx_operational_permissions_area` |
| `staff_activities` | `id` | `staff_profile_id` | None | `target_reference_id > 0` | `idx_staff_activities_staff_time`, `idx_staff_activities_target`, `idx_staff_activities_domain_time` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: Không dùng mặc định; có thể thêm cho `activity_note` nếu cần audit search.
- Generated Column: Không dùng.

## FK Delete Rule / Quy tắc xóa FK

- Staff profile -> assignment/permission/activity: Restrict trong audit window.
- Actor `assigned_by`: Set Null.
- User -> staff profile: Restrict nếu staff còn activity.

## Performance & Retention / Hiệu năng và lưu giữ

- `staff_activities` là ứng viên partition/archive theo `activity_at`.
- Activity giữ đủ lâu để audit xử lý đơn, kho và khách hàng.
