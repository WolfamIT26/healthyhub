# Review Physical Database / Database vật lý domain đánh giá

## Prompt 33 executable status / Trạng thái executable Prompt 33

**Review persistence READY.** Migration `1760000015000-enable-reviews-ratings-v1` is forward/reversible and TypeORM remains `synchronize=false`.

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `product_reviews` | Đánh giá sản phẩm. |
| `review_moderations` | Future design only; not created. |
| `review_reports` | Future design only; not created. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `product_reviews` | `customer_profile_id` | `BIGINT UNSIGNED` | No | None | FK Customer. |
| `product_reviews` | `product_id` | `BIGINT UNSIGNED` | No | None | FK Product. |
| `product_reviews` | `order_id` | `BIGINT UNSIGNED` | No | None | FK Order; required in V1. |
| `product_reviews` | `rating` | `TINYINT UNSIGNED` | No | None | 1-5. |
| `product_reviews` | `review_content` | `TEXT` | No | None | Trimmed length 3–2000. |
| `product_reviews` | `review_status` | `VARCHAR(32)` | No | `published` | published/hidden/rejected; soft delete uses audit field. |
| `product_reviews` | `submitted_at` | `DATETIME(3)` | No | Current time | Submit. |
| `product_reviews` | `published_at` | `DATETIME(3)` | Yes | `NULL` | Publish. |
| `review_moderations` | `product_review_id` | `BIGINT UNSIGNED` | No | None | FK Review. |
| `review_moderations` | `moderation_status` | `VARCHAR(32)` | No | `pending` | pending/approved/rejected. |
| `review_moderations` | `moderation_reason` | `VARCHAR(500)` | Yes | `NULL` | Required when rejected. |
| `review_moderations` | `moderated_at` | `DATETIME(3)` | Yes | `NULL` | Review time. |
| `review_moderations` | `moderated_by` | `BIGINT UNSIGNED` | Yes | `NULL` | FK User. |
| `review_reports` | `product_review_id` | `BIGINT UNSIGNED` | No | None | FK Review. |
| `review_reports` | `reported_by` | `BIGINT UNSIGNED` | Yes | `NULL` | FK User. |
| `review_reports` | `report_reason` | `VARCHAR(500)` | No | None | Required. |
| `review_reports` | `report_status` | `VARCHAR(32)` | No | `open` | open/reviewed/dismissed. |
| `review_reports` | `reported_at` | `DATETIME(3)` | No | Current time | Report time. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `product_reviews` | `id` | `customer_profile_id`, `product_id`, `order_id`; actor FKs SET NULL | `(tenant_id, order_id, product_id)` | rating 1–5; trimmed content 3–2000; exact status enum | `idx_product_reviews_public`, `idx_product_reviews_customer`, `idx_product_reviews_order` |
| `review_moderations` | `id` | `product_review_id`, `moderated_by` | One current moderation per review by migration rule | reason required when rejected | `idx_review_moderations_review_status` |
| `review_reports` | `id` | `product_review_id`, `reported_by` | None | report_reason required | `idx_review_reports_review_status`, `idx_review_reports_status_time` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: Không tạo trong V1 vì Admin moderation/search ngoài scope.
- Generated Column: Không dùng.

## FK Delete Rule / Quy tắc xóa FK

- Product/Customer/Order -> review: Restrict nếu review published.
- Actor FKs in moderation/report: Set Null.

## Performance & Retention / Hiệu năng và lưu giữ

- Public review query theo `product_id`, `review_status`, `published_at`.
- Hidden/rejected review giữ để audit moderation.
