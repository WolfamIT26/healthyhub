# Review Physical Database / Database vật lý domain đánh giá

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `product_reviews` | Đánh giá sản phẩm. |
| `review_moderations` | Kiểm duyệt review. |
| `review_reports` | Báo cáo vi phạm review. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `product_reviews` | `customer_profile_id` | `BIGINT UNSIGNED` | No | None | FK Customer. |
| `product_reviews` | `product_id` | `BIGINT UNSIGNED` | No | None | FK Product. |
| `product_reviews` | `order_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Order nullable. |
| `product_reviews` | `rating` | `TINYINT UNSIGNED` | No | None | 1-5. |
| `product_reviews` | `review_content` | `TEXT` | Yes | `NULL` | Nội dung. |
| `product_reviews` | `review_status` | `VARCHAR(32)` | No | `pending` | pending/published/hidden/rejected. |
| `product_reviews` | `review_source` | `VARCHAR(32)` | No | `manual` | verified_order/manual/imported. |
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
| `product_reviews` | `id` | `customer_profile_id`, `product_id`, `order_id` | One active review per customer/product/order by migration rule | `rating BETWEEN 1 AND 5` | `idx_reviews_product_status`, `idx_reviews_customer_time`, `ft_reviews_content` |
| `review_moderations` | `id` | `product_review_id`, `moderated_by` | One current moderation per review by migration rule | reason required when rejected | `idx_review_moderations_review_status` |
| `review_reports` | `id` | `product_review_id`, `reported_by` | None | report_reason required | `idx_review_reports_review_status`, `idx_review_reports_status_time` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: `review_content` cho admin moderation/search.
- Generated Column: Không dùng.

## FK Delete Rule / Quy tắc xóa FK

- Product/Customer/Order -> review: Restrict nếu review published.
- Actor FKs in moderation/report: Set Null.

## Performance & Retention / Hiệu năng và lưu giữ

- Public review query theo `product_id`, `review_status`, `published_at`.
- Hidden/rejected review giữ để audit moderation.
