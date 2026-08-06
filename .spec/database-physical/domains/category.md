# Category Physical Database / Database vật lý domain danh mục

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `categories` | Cây danh mục sản phẩm. |
| `category_display_rules` | Quy tắc hiển thị danh mục. |
| `product_category_links` | Liên kết sản phẩm và danh mục. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `categories` | `category_name` | `VARCHAR(255)` | No | None | Tên danh mục. |
| `categories` | `slug` | `VARCHAR(191)` | No | None | Unique SEO. |
| `categories` | `description` | `VARCHAR(500)` | Yes | `NULL` | Mô tả ngắn. |
| `categories` | `parent_category_id` | `BIGINT UNSIGNED` | Yes | `NULL` | Self FK. |
| `categories` | `category_status` | `VARCHAR(32)` | No | `active` | active/hidden/archived. |
| `categories` | `category_visibility` | `VARCHAR(32)` | No | `public` | public/private. |
| `category_display_rules` | `category_id` | `BIGINT UNSIGNED` | No | None | FK Category. |
| `category_display_rules` | `display_channel` | `VARCHAR(32)` | No | `web` | web/mobile/admin. |
| `category_display_rules` | `display_order` | `INT UNSIGNED` | No | `0` | Sort. |
| `category_display_rules` | `rule_status` | `VARCHAR(32)` | No | `active` | active/inactive/expired. |
| `category_display_rules` | `effective_from` | `DATETIME(3)` | No | Current time | Hiệu lực. |
| `category_display_rules` | `effective_to` | `DATETIME(3)` | Yes | `NULL` | Hết hiệu lực. |
| `product_category_links` | `product_id` | `BIGINT UNSIGNED` | No | None | FK Product. |
| `product_category_links` | `category_id` | `BIGINT UNSIGNED` | No | None | FK Category. |
| `product_category_links` | `is_primary` | `TINYINT(1)` | No | `0` | Danh mục chính. |
| `product_category_links` | `link_status` | `VARCHAR(32)` | No | `active` | active/inactive. |
| `product_category_links` | `linked_at` | `DATETIME(3)` | No | Current time | Audit nghiệp vụ. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `categories` | `id` | `parent_category_id` -> `categories.id` | `(tenant_id, slug)` | Parent không trỏ chính nó; status allowed | `idx_categories_parent`, `idx_categories_visibility_status`, `ft_categories_name` |
| `category_display_rules` | `id` | `category_id` | `(tenant_id, category_id, display_channel)` | `effective_to` null hoặc sau `effective_from` | `idx_category_display_channel_order` |
| `product_category_links` | `id` | `product_id`, `category_id` | `(tenant_id, product_id, category_id)` | `is_primary` 0/1 | `idx_product_category_product`, `idx_product_category_category`, unique primary per product by migration rule |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: `category_name`, `description` nếu category search public cần.
- Generated Column: Không dùng.

## FK Delete Rule / Quy tắc xóa FK

- Category parent-child: Restrict khi còn child active.
- Category/Product links: Restrict với dữ liệu active; dùng inactive/soft delete.

## Performance & Retention / Hiệu năng và lưu giữ

- Navigation public đọc theo `tenant_id`, `category_visibility`, `category_status`, `display_order`.
- Category archive giữ lại để không phá link SEO cũ.
