# Coupon Physical Database / Database vật lý domain mã giảm giá

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `coupons` | Mã giảm giá chính. |
| `coupon_conditions` | Điều kiện áp dụng coupon. |
| `coupon_usages` | Lịch sử sử dụng coupon. |
| `coupon_campaign_links` | Liên kết coupon với promotion. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `coupons` | `coupon_code` | `VARCHAR(64)` | No | None | Unique. |
| `coupons` | `discount_type` | `VARCHAR(32)` | No | None | fixed/percent/shipping. |
| `coupons` | `discount_value` | `DECIMAL(12,2)` | No | None | Money or percent value. |
| `coupons` | `usage_limit` | `INT UNSIGNED` | Yes | `NULL` | Null means unlimited by count. |
| `coupons` | `valid_from` | `DATETIME(3)` | No | Current time | Start. |
| `coupons` | `valid_to` | `DATETIME(3)` | Yes | `NULL` | End. |
| `coupons` | `coupon_status` | `VARCHAR(32)` | No | `draft` | draft/active/expired/disabled. |
| `coupon_conditions` | `coupon_id` | `BIGINT UNSIGNED` | No | None | FK Coupon. |
| `coupon_conditions` | `condition_type` | `VARCHAR(64)` | No | None | order_total/product/customer_segment. |
| `coupon_conditions` | `condition_value` | `JSON` | No | None | Rule payload. |
| `coupon_conditions` | `condition_status` | `VARCHAR(32)` | No | `active` | active/inactive. |
| `coupon_usages` | `coupon_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Coupon nullable for snapshot. |
| `coupon_usages` | `order_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Order. |
| `coupon_usages` | `customer_profile_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Customer. |
| `coupon_usages` | `coupon_code_snapshot` | `VARCHAR(64)` | No | None | Snapshot. |
| `coupon_usages` | `discount_applied` | `DECIMAL(12,2)` | No | `0.00` | Discount. |
| `coupon_usages` | `used_at` | `DATETIME(3)` | Yes | `NULL` | Used time. |
| `coupon_usages` | `usage_status` | `VARCHAR(32)` | No | `reserved` | reserved/used/reverted. |
| `coupon_campaign_links` | `coupon_id` | `BIGINT UNSIGNED` | No | None | FK Coupon. |
| `coupon_campaign_links` | `promotion_id` | `BIGINT UNSIGNED` | No | None | FK Promotion. |
| `coupon_campaign_links` | `link_status` | `VARCHAR(32)` | No | `active` | active/inactive. |
| `coupon_campaign_links` | `linked_at` | `DATETIME(3)` | No | Current time | Link time. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `coupons` | `id` | None | `(tenant_id, coupon_code)` | `discount_value >= 0`, valid_to after valid_from | `idx_coupons_status_validity`, `idx_coupons_type_status` |
| `coupon_conditions` | `id` | `coupon_id` | `(tenant_id, coupon_id, condition_type)` | JSON valid by MySQL type | `idx_coupon_conditions_coupon_status` |
| `coupon_usages` | `id` | `coupon_id`, `order_id`, `customer_profile_id` | One used coupon per order/code by migration rule | discount >= 0 | `idx_coupon_usages_coupon_status`, `idx_coupon_usages_customer_time`, `idx_coupon_usages_order` |
| `coupon_campaign_links` | `id` | `coupon_id`, `promotion_id` | `(tenant_id, coupon_id, promotion_id)` | `link_status` allowed | `idx_coupon_campaign_coupon`, `idx_coupon_campaign_promotion` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: Không dùng.
- Generated Column: Có thể tạo generated column từ `condition_value` cho điều kiện phổ biến sau khi có query thật.

## FK Delete Rule / Quy tắc xóa FK

- Coupon -> conditions/usages/links: Restrict nếu đã active/used.
- Order/Customer FK trong usage: Restrict với dữ liệu giao dịch; coupon_id có thể Set Null nếu chỉ còn snapshot theo policy.

## Performance & Retention / Hiệu năng và lưu giữ

- Validate coupon cần index theo `coupon_code`, status và validity.
- Usage giữ để chống vượt limit và phục vụ analytics.
