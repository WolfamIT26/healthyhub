# Loyalty Physical Database / Database vật lý domain thành viên

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `loyalty_accounts` | Tài khoản điểm khách hàng. |
| `loyalty_transactions` | Giao dịch điểm. |
| `membership_tiers` | Hạng thành viên. |
| `vip_qualifications` | Kết quả xét VIP. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `loyalty_accounts` | `customer_profile_id` | `BIGINT UNSIGNED` | No | None | FK Customer. |
| `loyalty_accounts` | `membership_tier_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Tier. |
| `loyalty_accounts` | `point_balance` | `INT UNSIGNED` | No | `0` | Current points. |
| `loyalty_accounts` | `tier_level` | `VARCHAR(32)` | No | `member` | member/vip. |
| `loyalty_accounts` | `loyalty_status` | `VARCHAR(32)` | No | `active` | active/suspended/closed. |
| `loyalty_accounts` | `joined_at` | `DATETIME(3)` | No | Current time | Join time. |
| `loyalty_transactions` | `loyalty_account_id` | `BIGINT UNSIGNED` | No | None | FK Loyalty. |
| `loyalty_transactions` | `order_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Order. |
| `loyalty_transactions` | `point_delta` | `INT` | No | None | +/- points. |
| `loyalty_transactions` | `transaction_type` | `VARCHAR(32)` | No | None | earn/redeem/adjust/reverse. |
| `loyalty_transactions` | `transaction_reason` | `VARCHAR(500)` | No | None | Required. |
| `loyalty_transactions` | `occurred_at` | `DATETIME(3)` | No | Current time | Time. |
| `loyalty_transactions` | `transaction_status` | `VARCHAR(32)` | No | `pending` | pending/confirmed/reversed. |
| `membership_tiers` | `tier_code` | `VARCHAR(64)` | No | None | Unique. |
| `membership_tiers` | `tier_level` | `VARCHAR(32)` | No | None | member/vip. |
| `membership_tiers` | `tier_rule` | `JSON` | No | None | Qualification rule. |
| `membership_tiers` | `benefit` | `JSON` | Yes | `NULL` | Benefits. |
| `membership_tiers` | `tier_status` | `VARCHAR(32)` | No | `active` | active/inactive. |
| `vip_qualifications` | `loyalty_account_id` | `BIGINT UNSIGNED` | No | None | FK Loyalty. |
| `vip_qualifications` | `membership_tier_id` | `BIGINT UNSIGNED` | No | None | FK Tier. |
| `vip_qualifications` | `qualification_period` | `VARCHAR(64)` | No | None | e.g. 2026-Q3. |
| `vip_qualifications` | `qualification_status` | `VARCHAR(32)` | No | `not_qualified` | qualified/not_qualified/expired. |
| `vip_qualifications` | `evaluated_at` | `DATETIME(3)` | No | Current time | Evaluation. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `loyalty_accounts` | `id` | `customer_profile_id`, `membership_tier_id` | `(tenant_id, customer_profile_id)` | `point_balance >= 0` | `idx_loyalty_accounts_status_tier` |
| `loyalty_transactions` | `id` | `loyalty_account_id`, `order_id` | None | `point_delta <> 0` | `idx_loyalty_transactions_account_time`, `idx_loyalty_transactions_order`, `idx_loyalty_transactions_type_status` |
| `membership_tiers` | `id` | None | `(tenant_id, tier_code)` | `tier_status` allowed | `idx_membership_tiers_level_status` |
| `vip_qualifications` | `id` | `loyalty_account_id`, `membership_tier_id` | `(tenant_id, loyalty_account_id, membership_tier_id, qualification_period)` | `qualification_status` allowed | `idx_vip_qualifications_period_status` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: Không dùng.
- Generated Column: Không dùng.

## FK Delete Rule / Quy tắc xóa FK

- Customer -> loyalty account: Restrict khi có transaction.
- Loyalty account -> transactions/qualifications: Restrict.
- Order FK trong transaction: Restrict hoặc Set Null chỉ khi transaction vẫn giữ reason/snapshot theo policy.

## Performance & Retention / Hiệu năng và lưu giữ

- Customer loyalty lookup theo `customer_profile_id`.
- Transaction history giữ dài hạn để audit điểm; archive theo `occurred_at` khi lớn.
