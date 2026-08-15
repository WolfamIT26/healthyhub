# Product Physical Database / Database vật lý domain sản phẩm

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `products` | Sản phẩm chính. |
| `product_contents` | Nội dung mô tả/SEO của sản phẩm. |
| `product_ingredients` | Thành phần và cảnh báo dị ứng. |
| `product_media_links` | Liên kết sản phẩm với media. |
| `product_dietary_tags` | Dietary tag whitelist cho Product public. |
| `product_nutrition_facts` | Nutrition presentation cho Product public. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `products` | `brand_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Brand. |
| `products` | `product_code` | `VARCHAR(64)` | No | None | Unique. |
| `products` | `product_name` | `VARCHAR(255)` | No | None | Search/display. |
| `products` | `slug` | `VARCHAR(191)` | No | None | Unique SEO. |
| `products` | `base_price` | `DECIMAL(12,2)` | No | `0.00` | Money. |
| `products` | `sellable_status` | `VARCHAR(32)` | No | `unavailable` | sellable/out_of_stock/preorder. |
| `products` | `product_visibility` | `VARCHAR(32)` | No | `hidden` | public/hidden/private. |
| `products` | `product_status` | `VARCHAR(32)` | No | `draft` | draft/active/discontinued. |
| `products` | `is_featured` | `TINYINT(1)` | No | `0` | Public featured ordering. |
| `product_contents` | `product_id` | `BIGINT UNSIGNED` | No | None | FK Product. |
| `product_contents` | `description` | `TEXT` | No | None | Mô tả. |
| `product_contents` | `summary` | `VARCHAR(500)` | Yes | `NULL` | Tóm tắt. |
| `product_contents` | `usage_note` | `TEXT` | Yes | `NULL` | Lưu ý dùng. |
| `product_contents` | `storage_note` | `TEXT` | Yes | `NULL` | Lưu ý bảo quản. |
| `product_contents` | `seo_title` | `VARCHAR(255)` | Yes | `NULL` | SEO. |
| `product_contents` | `seo_description` | `VARCHAR(500)` | Yes | `NULL` | SEO. |
| `product_contents` | `content_status` | `VARCHAR(32)` | No | `draft` | draft/review/published. |
| `product_ingredients` | `product_id` | `BIGINT UNSIGNED` | No | None | FK Product. |
| `product_ingredients` | `ingredient_name` | `VARCHAR(255)` | No | None | Thành phần. |
| `product_ingredients` | `ingredient_description` | `TEXT` | Yes | `NULL` | Giải thích. |
| `product_ingredients` | `nutrition_note` | `TEXT` | Yes | `NULL` | Dinh dưỡng. |
| `product_ingredients` | `allergy_warning` | `VARCHAR(500)` | Yes | `NULL` | Dị ứng. |
| `product_ingredients` | `display_order` | `INT UNSIGNED` | No | `0` | Sắp xếp. |
| `product_media_links` | `product_id` | `BIGINT UNSIGNED` | No | None | FK Product. |
| `product_media_links` | `media_asset_id` | `BIGINT UNSIGNED` | No | None | FK Media. |
| `product_media_links` | `media_role` | `VARCHAR(64)` | No | `gallery` | main/gallery/nutrition. |
| `product_media_links` | `display_order` | `INT UNSIGNED` | No | `0` | Sắp xếp. |
| `product_media_links` | `link_status` | `VARCHAR(32)` | No | `active` | active/inactive. |
| `product_dietary_tags` | `product_id` | `BIGINT UNSIGNED` | No | None | FK Product. |
| `product_dietary_tags` | `dietary_tag` | `VARCHAR(32)` | No | None | Approved tag enum. |
| `product_nutrition_facts` | `product_id` | `BIGINT UNSIGNED` | No | None | One row per Product. |
| `product_nutrition_facts` | `serving_size`, `calories`, `protein`, `carbohydrates`, `fat`, `sugar` | `VARCHAR(100)` | Yes | `NULL` | Preserve published units/text. |
| `product_nutrition_facts` | `note` | `VARCHAR(500)` | Yes | `NULL` | Public qualification. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `products` | `id` | `brand_id` -> `brands.id` | `(tenant_id, product_code)`, `(tenant_id, slug)` | `base_price >= 0`, status allowed | `idx_products_tenant_status_visibility`, `idx_products_brand_status`, `ft_products_name` |
| `product_contents` | `id` | `product_id` | One published content per product by migration rule | `content_status` allowed | `idx_product_contents_product_status`, `ft_product_contents_text` |
| `product_ingredients` | `id` | `product_id` | `(tenant_id, product_id, ingredient_name)` | `display_order >= 0` | `idx_product_ingredients_product_order`, `ft_product_ingredients_name` |
| `product_media_links` | `id` | `product_id`, `media_asset_id` | `(tenant_id, product_id, media_asset_id, media_role)` | `display_order >= 0` | `idx_product_media_product_role`, `idx_product_media_media` |
| `product_dietary_tags` | `id` | `product_id` | `(tenant_id, product_id, dietary_tag)` | dietary whitelist | `idx_product_dietary_tag_product` |
| `product_nutrition_facts` | `id` | `product_id` | `(tenant_id, product_id)` | None | unique Product lookup |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: `product_name`, `description`, `summary`, `ingredient_name` phục vụ search MVP nếu chưa có search engine.
- Generated Column: Không dùng ở MVP; nếu cần lọc giá sau promotion sẽ tạo read model riêng thay vì generated column.

## FK Delete Rule / Quy tắc xóa FK

- Brand -> Product: Set Null nếu brand archived/hard delete theo policy, nhưng mặc định Restrict khi product active.
- Product -> content/ingredient/media link: Restrict nếu product đã public/order; soft delete là mặc định.
- Media link -> Media: Restrict nếu media đang active trong product.

## Performance & Retention / Hiệu năng và lưu giữ

- Query catalog public dùng `(tenant_id, product_visibility, sellable_status, product_status)`.
- Product đã có order không hard delete; chuyển discontinued/hidden.
