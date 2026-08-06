# Blog Physical Database / Database vật lý domain bài viết

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `blog_posts` | Bài viết healthy/SEO. |
| `blog_content_blocks` | Khối nội dung bài viết. |
| `blog_media_links` | Liên kết bài viết và media. |
| `seo_metadata` | Metadata SEO cho blog/product content. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `blog_posts` | `author_user_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK User. |
| `blog_posts` | `post_title` | `VARCHAR(255)` | No | None | Title. |
| `blog_posts` | `post_slug` | `VARCHAR(191)` | No | None | Unique SEO. |
| `blog_posts` | `post_summary` | `VARCHAR(500)` | Yes | `NULL` | Summary. |
| `blog_posts` | `post_status` | `VARCHAR(32)` | No | `draft` | draft/review/published/hidden/archived. |
| `blog_posts` | `content_review_status` | `VARCHAR(32)` | No | `draft` | needs_review/approved/rejected. |
| `blog_posts` | `health_disclaimer` | `VARCHAR(500)` | Yes | `NULL` | Required for health content. |
| `blog_posts` | `published_at` | `DATETIME(3)` | Yes | `NULL` | Publish time. |
| `blog_content_blocks` | `blog_post_id` | `BIGINT UNSIGNED` | No | None | FK Blog. |
| `blog_content_blocks` | `block_type` | `VARCHAR(64)` | No | `paragraph` | paragraph/image/quote. |
| `blog_content_blocks` | `block_content` | `MEDIUMTEXT` | No | None | Nội dung. |
| `blog_content_blocks` | `display_order` | `INT UNSIGNED` | No | `0` | Sort. |
| `blog_content_blocks` | `block_status` | `VARCHAR(32)` | No | `draft` | draft/active/hidden. |
| `blog_media_links` | `blog_post_id` | `BIGINT UNSIGNED` | No | None | FK Blog. |
| `blog_media_links` | `media_asset_id` | `BIGINT UNSIGNED` | No | None | FK Media. |
| `blog_media_links` | `media_role` | `VARCHAR(64)` | No | `content` | hero/content/thumbnail. |
| `blog_media_links` | `display_order` | `INT UNSIGNED` | No | `0` | Sort. |
| `blog_media_links` | `link_status` | `VARCHAR(32)` | No | `active` | active/inactive. |
| `seo_metadata` | `blog_post_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Blog nullable. |
| `seo_metadata` | `product_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Product nullable. |
| `seo_metadata` | `seo_title` | `VARCHAR(255)` | Yes | `NULL` | SEO title. |
| `seo_metadata` | `seo_description` | `VARCHAR(500)` | Yes | `NULL` | SEO description. |
| `seo_metadata` | `canonical_reference` | `VARCHAR(500)` | Yes | `NULL` | Canonical URL/reference. |
| `seo_metadata` | `seo_status` | `VARCHAR(32)` | No | `draft` | draft/active/stale. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `blog_posts` | `id` | `author_user_id` | `(tenant_id, post_slug)` | Published cần `published_at` | `idx_blog_posts_status_published`, `ft_blog_posts_title_summary` |
| `blog_content_blocks` | `id` | `blog_post_id` | `(tenant_id, blog_post_id, display_order)` | `display_order >= 0` | `idx_blog_blocks_post_status`, `ft_blog_blocks_content` |
| `blog_media_links` | `id` | `blog_post_id`, `media_asset_id` | `(tenant_id, blog_post_id, media_asset_id, media_role)` | `display_order >= 0` | `idx_blog_media_post_role` |
| `seo_metadata` | `id` | `blog_post_id`, `product_id` | One active SEO metadata per target by migration rule | Blog hoặc Product phải có một target | `idx_seo_metadata_blog`, `idx_seo_metadata_product` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: `post_title`, `post_summary`, `block_content` cho search blog.
- Generated Column: Không dùng.

## FK Delete Rule / Quy tắc xóa FK

- Blog -> content/media/seo: Restrict khi bài đã public; draft có thể cascade ở migration nếu chưa public và không audit.
- Author User: Set Null khi user bị xóa mềm/hard delete theo policy.

## Performance & Retention / Hiệu năng và lưu giữ

- Public blog query theo `(tenant_id, post_status, published_at)`.
- Blog public giữ archive để bảo toàn SEO/history.
