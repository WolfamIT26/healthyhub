# Wishlist Physical Database / Database vật lý domain yêu thích

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `wishlists` | Danh sách yêu thích của customer. |
| `wishlist_items` | Sản phẩm được lưu. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `wishlists` | `customer_profile_id` | `BIGINT UNSIGNED` | No | None | FK Customer. |
| `wishlists` | `wishlist_name` | `VARCHAR(150)` | No | `Default` | Tên danh sách. |
| `wishlists` | `wishlist_visibility` | `VARCHAR(32)` | No | `private` | private/shared future. |
| `wishlists` | `wishlist_status` | `VARCHAR(32)` | No | `active` | active/archived. |
| `wishlist_items` | `wishlist_id` | `BIGINT UNSIGNED` | No | None | FK Wishlist. |
| `wishlist_items` | `product_id` | `BIGINT UNSIGNED` | No | None | FK Product. |
| `wishlist_items` | `saved_at` | `DATETIME(3)` | No | Current time | Lifecycle. |
| `wishlist_items` | `wishlist_item_status` | `VARCHAR(32)` | No | `active` | active/removed/unavailable. |
| `wishlist_items` | `note` | `VARCHAR(500)` | Yes | `NULL` | Ghi chú cá nhân. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `wishlists` | `id` | `customer_profile_id` | `(tenant_id, customer_profile_id, wishlist_name)` | `wishlist_visibility/status` allowed | `idx_wishlists_customer_status` |
| `wishlist_items` | `id` | `wishlist_id`, `product_id` | `(tenant_id, wishlist_id, product_id, wishlist_item_status)` | `saved_at` not future by app rule | `idx_wishlist_items_wishlist`, `idx_wishlist_items_product` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: Không dùng mặc định.
- Generated Column: Không dùng.

## FK Delete Rule / Quy tắc xóa FK

- Customer -> wishlist: Restrict trong privacy/audit window; archive/anonymize theo policy.
- Product -> wishlist item: Restrict; item chuyển unavailable khi product hidden/discontinued.

## Performance & Retention / Hiệu năng và lưu giữ

- Customer wishlist query dùng `(tenant_id, customer_profile_id, wishlist_status)`.
- Removed items có thể purge theo retention nếu không dùng cho AI/recommendation audit.
