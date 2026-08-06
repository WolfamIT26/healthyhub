# Media Physical Database / Database vật lý domain media

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `media_assets` | Metadata file media. |
| `media_usages` | Media đang được dùng ở domain nào. |
| `media_access_policies` | Chính sách quyền xem/tải. |
| `media_metadata` | Alt text, caption, certificate reference, OCR metadata future. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `media_assets` | `media_name` | `VARCHAR(255)` | No | None | Tên file logic. |
| `media_assets` | `media_type` | `VARCHAR(32)` | No | None | image/document/banner/certificate. |
| `media_assets` | `media_purpose` | `VARCHAR(64)` | No | None | product/blog/ai_upload. |
| `media_assets` | `storage_reference` | `VARCHAR(500)` | No | None | Path/key, không secret. |
| `media_assets` | `media_visibility` | `VARCHAR(32)` | No | `private` | public/private/restricted. |
| `media_assets` | `media_status` | `VARCHAR(32)` | No | `uploaded` | uploaded/active/hidden/archived/failed. |
| `media_usages` | `media_asset_id` | `BIGINT UNSIGNED` | No | None | FK Media. |
| `media_usages` | `usage_domain` | `VARCHAR(64)` | No | None | product, blog, brand, ai. |
| `media_usages` | `usage_reference_id` | `BIGINT UNSIGNED` | No | None | ID ở domain nguồn. |
| `media_usages` | `usage_role` | `VARCHAR(64)` | No | None | main/gallery/certificate. |
| `media_usages` | `usage_status` | `VARCHAR(32)` | No | `active` | active/inactive. |
| `media_access_policies` | `media_asset_id` | `BIGINT UNSIGNED` | No | None | FK Media. |
| `media_access_policies` | `access_scope` | `VARCHAR(64)` | No | `tenant` | public/customer/staff. |
| `media_access_policies` | `allow_public` | `TINYINT(1)` | No | `0` | Boolean. |
| `media_access_policies` | `policy_status` | `VARCHAR(32)` | No | `active` | active/inactive. |
| `media_metadata` | `media_asset_id` | `BIGINT UNSIGNED` | No | None | FK Media. |
| `media_metadata` | `alt_text` | `VARCHAR(500)` | Yes | `NULL` | SEO/accessibility. |
| `media_metadata` | `caption` | `VARCHAR(500)` | Yes | `NULL` | Caption. |
| `media_metadata` | `certificate_reference` | `VARCHAR(191)` | Yes | `NULL` | Reference. |
| `media_metadata` | `metadata_status` | `VARCHAR(32)` | No | `active` | active/stale. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `media_assets` | `id` | None | None | `media_type/status` allowed | `idx_media_assets_status_type`, `idx_media_assets_purpose_visibility`, `ft_media_assets_name` |
| `media_usages` | `id` | `media_asset_id` | `(tenant_id, media_asset_id, usage_domain, usage_reference_id, usage_role)` | `usage_reference_id > 0` | `idx_media_usages_domain_reference`, `idx_media_usages_media` |
| `media_access_policies` | `id` | `media_asset_id` | `(tenant_id, media_asset_id, access_scope)` | `allow_public` 0/1 | `idx_media_access_policy_scope` |
| `media_metadata` | `id` | `media_asset_id` | `(tenant_id, media_asset_id)` | None | `idx_media_metadata_certificate` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: `media_name`, `alt_text`, `caption` nếu admin cần tìm media.
- Generated Column: Không dùng ở MVP.

## FK Delete Rule / Quy tắc xóa FK

- Media -> usages/policies/metadata: Restrict khi đang active; hard delete chỉ cho temporary media chưa dùng.
- Cross-domain usage không dùng FK vật lý đến domain nguồn để giữ khả năng tách service.

## Performance & Retention / Hiệu năng và lưu giữ

- Media list query theo purpose/status/visibility.
- Temporary media có retention ngắn; product/blog/certificate media giữ dài hạn.
