# Customer Physical Database / Database vật lý domain khách hàng

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `customer_profiles` | Hồ sơ khách hàng và consent. |
| `customer_addresses` | Địa chỉ khách hàng. |
| `customer_segments` | Phân nhóm khách hàng logic. |
| `support_notes` | Ghi chú chăm sóc khách. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `customer_profiles` | `user_account_id` | `BIGINT UNSIGNED` | Yes | `NULL` | Guest có thể chưa có user. |
| `customer_profiles` | `customer_code` | `VARCHAR(64)` | No | None | Unique theo tenant. |
| `customer_profiles` | `full_name` | `VARCHAR(255)` | No | None | Tên khách. |
| `customer_profiles` | `contact_info` | `JSON` | Yes | `NULL` | Email/phone snapshot có policy. |
| `customer_profiles` | `customer_status` | `VARCHAR(32)` | No | `active` | active, guest, blocked, archived. |
| `customer_profiles` | `consent_state` | `VARCHAR(32)` | No | `unknown` | Consent cho AI/marketing. |
| `customer_profiles` | `marketing_opt_in_status` | `VARCHAR(32)` | No | `not_opted_in` | Opt-in marketing. |
| `customer_profiles` | `primary_email` | `VARCHAR(254)` | Yes | Generated | Generated từ `contact_info` nếu cần index. |
| `customer_profiles` | `primary_phone` | `VARCHAR(32)` | Yes | Generated | Generated từ `contact_info` nếu cần index. |
| `customer_addresses` | `customer_profile_id` | `BIGINT UNSIGNED` | No | None | FK Customer. |
| `customer_addresses` | `recipient_name` | `VARCHAR(255)` | No | None | Người nhận. |
| `customer_addresses` | `phone` | `VARCHAR(32)` | No | None | Số nhận hàng. |
| `customer_addresses` | `country_code` | `CHAR(2)` | No | `VN` | Shipping V1 chỉ nhận Việt Nam. |
| `customer_addresses` | `province_city` | `VARCHAR(150)` | No | None | Tỉnh/thành dạng free-text. |
| `customer_addresses` | `district` | `VARCHAR(150)` | No | None | Quận/huyện dạng free-text. |
| `customer_addresses` | `ward` | `VARCHAR(150)` | Yes | `NULL` | Phường/xã tùy chọn. |
| `customer_addresses` | `address_line` | `VARCHAR(500)` | No | None | Số nhà/tên đường. |
| `customer_addresses` | `delivery_note` | `VARCHAR(500)` | Yes | `NULL` | Ghi chú giao hàng. |
| `customer_addresses` | `is_default` | `TINYINT(1)` | No | `0` | Default address. |
| `customer_addresses` | `address_status` | `VARCHAR(32)` | No | `active` | active, archived. |
| `customer_addresses` | `idempotency_key_hash` | `CHAR(64)` | Yes | `NULL` | Hash key tạo địa chỉ; không lưu raw key. |
| `customer_addresses` | `request_hash` | `CHAR(64)` | Yes | `NULL` | Phát hiện key reuse khác payload. |
| `customer_addresses` | `active_default_customer_id` | `BIGINT UNSIGNED` | Yes | Generated | Customer ID khi row active/default/chưa xóa, ngược lại NULL. |
| `customer_segments` | `customer_profile_id` | `BIGINT UNSIGNED` | Yes | `NULL` | Nullable nếu segment definition. |
| `customer_segments` | `segment_type` | `VARCHAR(64)` | No | None | manual, rule, vip future. |
| `customer_segments` | `segment_name` | `VARCHAR(150)` | No | None | Tên nhóm. |
| `customer_segments` | `segment_rule` | `JSON` | Yes | `NULL` | Rule phân nhóm. |
| `customer_segments` | `segment_status` | `VARCHAR(32)` | No | `active` | active, inactive. |
| `support_notes` | `customer_profile_id` | `BIGINT UNSIGNED` | No | None | FK Customer. |
| `support_notes` | `staff_profile_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Staff. |
| `support_notes` | `note_content` | `TEXT` | No | None | Ghi chú. |
| `support_notes` | `note_type` | `VARCHAR(64)` | No | `general` | general, complaint, care. |
| `support_notes` | `visibility_scope` | `VARCHAR(64)` | No | `staff` | staff, manager, admin. |
| `support_notes` | `noted_at` | `DATETIME(3)` | No | Current time | Audit nghiệp vụ. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `customer_profiles` | `id` | `user_account_id` -> `user_accounts.id` | `(tenant_id, customer_code)`, `(tenant_id, user_account_id)` | `customer_status/consent_state` allowed | `idx_customers_status_created`, `idx_customers_email_phone_generated` |
| `customer_addresses` | `id` | `customer_profile_id` RESTRICT | `(active_default_customer_id)`, `(tenant_id, customer_profile_id, idempotency_key_hash)` | `country_code = VN`, `is_default` 0/1, status active/archived | `idx_customer_addresses_customer_status` |
| `customer_segments` | `id` | `customer_profile_id` | `(tenant_id, customer_profile_id, segment_type, segment_name)` | `segment_status` allowed | `idx_customer_segments_type_status` |
| `support_notes` | `id` | `customer_profile_id`, `staff_profile_id` | None | `visibility_scope` allowed | `idx_support_notes_customer_time`, `idx_support_notes_staff_time` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: Không dùng mặc định; có thể cân nhắc cho `support_notes.note_content` nếu cần search nội bộ.
- Generated Column: `primary_email`, `primary_phone` từ `contact_info` nếu cần login/search customer bằng JSON data.

## FK Delete Rule / Quy tắc xóa FK

- Customer -> address/support note: Restrict khi còn order/support history.
- `user_account_id`: Set Null chỉ khi guest/merge policy cho phép; mặc định Restrict khi account còn active.
- `staff_profile_id`: Set Null nếu staff bị xóa mềm/hard delete theo policy.

## Performance & Retention / Hiệu năng và lưu giữ

- Search customer theo code/email/phone cần unique/index rõ.
- Customer data giữ khi còn order/loyalty; privacy request xử lý bằng anonymize/archive theo policy.
