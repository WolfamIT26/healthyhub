# Settings Physical Database / Database vật lý domain cấu hình

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `tenant_setting_profiles` | Hồ sơ cấu hình tenant/cửa hàng. |
| `store_settings` | Nhóm cấu hình theo area. |
| `setting_entries` | Giá trị cấu hình cụ thể. |
| `setting_change_requests` | Yêu cầu thay đổi cấu hình quan trọng. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `tenant_setting_profiles` | `tenant_mode` | `VARCHAR(32)` | No | `single_store` | single_store, multi_store_future. |
| `tenant_setting_profiles` | `profile_status` | `VARCHAR(32)` | No | `active` | active, inactive, archived. |
| `tenant_setting_profiles` | `effective_from` | `DATETIME(3)` | No | Current time | Hiệu lực. |
| `tenant_setting_profiles` | `effective_to` | `DATETIME(3)` | Yes | `NULL` | Hết hiệu lực. |
| `store_settings` | `tenant_setting_profile_id` | `BIGINT UNSIGNED` | No | None | FK profile. |
| `store_settings` | `configuration_area` | `VARCHAR(64)` | No | None | security, payment, shipping, ai. |
| `store_settings` | `setting_status` | `VARCHAR(32)` | No | `active` | active, inactive. |
| `setting_entries` | `store_setting_id` | `BIGINT UNSIGNED` | No | None | FK setting group. |
| `setting_entries` | `setting_key` | `VARCHAR(100)` | No | None | Unique theo scope. |
| `setting_entries` | `setting_value` | `JSON` | No | None | Không chứa secret raw. |
| `setting_entries` | `configuration_scope` | `VARCHAR(64)` | No | `tenant` | tenant, platform. |
| `setting_entries` | `is_sensitive` | `TINYINT(1)` | No | `0` | Che khi log. |
| `setting_entries` | `effective_from` | `DATETIME(3)` | No | Current time | Versioning. |
| `setting_change_requests` | `store_setting_id` | `BIGINT UNSIGNED` | No | None | FK. |
| `setting_change_requests` | `change_reason` | `VARCHAR(500)` | No | None | Required. |
| `setting_change_requests` | `change_status` | `VARCHAR(32)` | No | `requested` | requested, approved, rejected, applied. |
| `setting_change_requests` | `requested_at` | `DATETIME(3)` | No | Current time | Lifecycle. |
| `setting_change_requests` | `approved_at` | `DATETIME(3)` | Yes | `NULL` | Approval. |
| `setting_change_requests` | `requested_by` | `BIGINT UNSIGNED` | No | None | FK User. |
| `setting_change_requests` | `approved_by` | `BIGINT UNSIGNED` | Yes | `NULL` | FK User. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `tenant_setting_profiles` | `id` | None | One active profile per tenant by migration rule | `effective_to` null hoặc sau `effective_from` | `idx_tenant_profiles_status` |
| `store_settings` | `id` | `tenant_setting_profile_id` | `(tenant_id, configuration_area, setting_status)` | `configuration_area/status` allowed | `idx_store_settings_profile_area` |
| `setting_entries` | `id` | `store_setting_id` | `(tenant_id, configuration_scope, setting_key, deleted_at)` | `is_sensitive` 0/1 | `idx_setting_entries_key`, `idx_setting_entries_sensitive` |
| `setting_change_requests` | `id` | `store_setting_id`, `requested_by`, `approved_by` | None | `approved_at` null hoặc sau `requested_at` | `idx_setting_change_requests_status_time` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: Không dùng.
- Generated Column: Có thể tạo generated column theo `setting_value` cho các setting được query thường xuyên sau khi có use case thật.

## FK Delete Rule / Quy tắc xóa FK

- Profile -> settings/entries: Restrict; dùng inactive/expired thay vì hard delete.
- Request actor FK: Restrict với `requested_by`, Set Null với `approved_by` nếu actor bị xóa theo policy.

## Performance & Retention / Hiệu năng và lưu giữ

- Cache setting ở application layer sau này, nhưng database vẫn cần unique/index theo key.
- Change request giữ dài hạn vì ảnh hưởng bảo mật, payment, shipping và AI.
