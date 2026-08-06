# Promotion Physical Database / Database vật lý domain khuyến mãi

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `promotions` | Chương trình khuyến mãi. |
| `promotion_conditions` | Điều kiện promotion. |
| `promotion_schedules` | Lịch chạy promotion. |
| `promotion_targets` | Đối tượng áp dụng. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `promotions` | `promotion_name` | `VARCHAR(255)` | No | None | Campaign name. |
| `promotions` | `promotion_type` | `VARCHAR(32)` | No | None | discount/bundle/shipping/voucher. |
| `promotions` | `discount_policy` | `JSON` | No | None | Policy payload. |
| `promotions` | `stacking_rule` | `VARCHAR(32)` | No | `exclusive` | exclusive/stackable/priority. |
| `promotions` | `promotion_status` | `VARCHAR(32)` | No | `draft` | draft/active/paused/ended/archived. |
| `promotion_conditions` | `promotion_id` | `BIGINT UNSIGNED` | No | None | FK Promotion. |
| `promotion_conditions` | `condition_type` | `VARCHAR(64)` | No | None | order/product/customer/time. |
| `promotion_conditions` | `condition_value` | `JSON` | No | None | Rule. |
| `promotion_conditions` | `condition_status` | `VARCHAR(32)` | No | `active` | active/inactive. |
| `promotion_schedules` | `promotion_id` | `BIGINT UNSIGNED` | No | None | FK Promotion. |
| `promotion_schedules` | `start_at` | `DATETIME(3)` | No | None | Start. |
| `promotion_schedules` | `end_at` | `DATETIME(3)` | Yes | `NULL` | End. |
| `promotion_schedules` | `schedule_status` | `VARCHAR(32)` | No | `scheduled` | scheduled/active/expired. |
| `promotion_targets` | `promotion_id` | `BIGINT UNSIGNED` | No | None | FK Promotion. |
| `promotion_targets` | `target_type` | `VARCHAR(64)` | No | None | product/category/customer_segment/order. |
| `promotion_targets` | `target_reference_id` | `BIGINT UNSIGNED` | No | None | Cross-domain reference. |
| `promotion_targets` | `target_status` | `VARCHAR(32)` | No | `active` | active/inactive. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `promotions` | `id` | None | None | `promotion_status/type` allowed | `idx_promotions_status_type`, `ft_promotions_name` |
| `promotion_conditions` | `id` | `promotion_id` | `(tenant_id, promotion_id, condition_type)` | JSON valid | `idx_promotion_conditions_promotion_status` |
| `promotion_schedules` | `id` | `promotion_id` | None | `end_at` null hoặc sau `start_at` | `idx_promotion_schedules_time_status`, `idx_promotion_schedules_promotion` |
| `promotion_targets` | `id` | `promotion_id` | `(tenant_id, promotion_id, target_type, target_reference_id)` | `target_reference_id > 0` | `idx_promotion_targets_type_reference`, `idx_promotion_targets_promotion_status` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: `promotion_name` cho admin search.
- Generated Column: Có thể tạo field extracted từ `discount_policy` nếu cần lọc rule phổ biến sau.

## FK Delete Rule / Quy tắc xóa FK

- Promotion -> children: Restrict khi promotion đã active.
- Target reference không dùng FK vật lý cross-domain để hỗ trợ tách service.

## Performance & Retention / Hiệu năng và lưu giữ

- Promotion matching cần index theo schedule/status/target.
- Promotion đã chạy giữ archive để báo cáo doanh thu/marketing.
