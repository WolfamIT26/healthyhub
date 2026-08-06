# Brand Physical Database / Database vật lý domain thương hiệu

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `brands` | Thương hiệu hoặc nhà sản xuất. |
| `brand_certificates` | Chứng nhận thương hiệu. |
| `brand_media_links` | Liên kết brand với logo/certificate media. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `brands` | `brand_name` | `VARCHAR(255)` | No | None | Tên brand. |
| `brands` | `brand_slug` | `VARCHAR(191)` | No | None | Unique SEO. |
| `brands` | `brand_origin` | `VARCHAR(150)` | Yes | `NULL` | Xuất xứ. |
| `brands` | `brand_status` | `VARCHAR(32)` | No | `active` | active/hidden/archived. |
| `brands` | `description` | `TEXT` | Yes | `NULL` | Mô tả. |
| `brand_certificates` | `brand_id` | `BIGINT UNSIGNED` | No | None | FK Brand. |
| `brand_certificates` | `certificate_name` | `VARCHAR(255)` | No | None | Tên chứng nhận. |
| `brand_certificates` | `certificate_info` | `JSON` | Yes | `NULL` | Metadata. |
| `brand_certificates` | `issued_at` | `DATETIME(3)` | Yes | `NULL` | Ngày cấp. |
| `brand_certificates` | `expires_at` | `DATETIME(3)` | Yes | `NULL` | Ngày hết hạn. |
| `brand_certificates` | `certificate_status` | `VARCHAR(32)` | No | `pending` | valid/expired/revoked/pending. |
| `brand_media_links` | `brand_id` | `BIGINT UNSIGNED` | No | None | FK Brand. |
| `brand_media_links` | `media_asset_id` | `BIGINT UNSIGNED` | No | None | FK Media. |
| `brand_media_links` | `media_role` | `VARCHAR(64)` | No | `logo` | logo/certificate/banner. |
| `brand_media_links` | `display_order` | `INT UNSIGNED` | No | `0` | Sort. |
| `brand_media_links` | `link_status` | `VARCHAR(32)` | No | `active` | active/inactive. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `brands` | `id` | None | `(tenant_id, brand_slug)`, `(tenant_id, brand_name)` | `brand_status` allowed | `idx_brands_status`, `ft_brands_name_description` |
| `brand_certificates` | `id` | `brand_id` | `(tenant_id, brand_id, certificate_name)` | `expires_at` null hoặc sau `issued_at` | `idx_brand_certificates_brand_status` |
| `brand_media_links` | `id` | `brand_id`, `media_asset_id` | `(tenant_id, brand_id, media_asset_id, media_role)` | `display_order >= 0` | `idx_brand_media_brand_role`, `idx_brand_media_media` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: `brand_name`, `description` cho tìm kiếm brand.
- Generated Column: Không dùng ở MVP.

## FK Delete Rule / Quy tắc xóa FK

- Brand -> certificates/media links/products: Restrict khi còn product active hoặc certificate public.
- Media link -> Media: Restrict khi link active.

## Performance & Retention / Hiệu năng và lưu giữ

- Brand list lọc theo `tenant_id`, `brand_status`.
- Certificate giữ history vì liên quan uy tín/nguồn gốc sản phẩm.
