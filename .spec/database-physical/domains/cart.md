# Cart Physical Database / Database vật lý domain giỏ hàng

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `carts` | Giỏ hàng customer/guest. |
| `cart_items` | Dòng sản phẩm trong giỏ. |
| `applied_cart_coupons` | Coupon đã áp ở giỏ. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `carts` | `customer_profile_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Customer nullable. |
| `carts` | `cart_owner_type` | `VARCHAR(32)` | No | `guest` | guest/customer. |
| `carts` | `guest_session_reference` | `VARCHAR(191)` | Yes | `NULL` | Guest key. |
| `carts` | `cart_status` | `VARCHAR(32)` | No | `active` | active/checked_out/abandoned/expired. |
| `carts` | `cart_validation_status` | `VARCHAR(32)` | No | `not_validated` | valid/invalid/not_validated. |
| `carts` | `last_validated_at` | `DATETIME(3)` | Yes | `NULL` | Validation. |
| `cart_items` | `cart_id` | `BIGINT UNSIGNED` | No | None | FK Cart. |
| `cart_items` | `product_id` | `BIGINT UNSIGNED` | No | None | FK Product. |
| `cart_items` | `quantity` | `INT UNSIGNED` | No | `1` | > 0. |
| `cart_items` | `item_price_snapshot` | `DECIMAL(12,2)` | Yes | `NULL` | Giá validate gần nhất. |
| `cart_items` | `item_status` | `VARCHAR(32)` | No | `active` | active/unavailable/removed. |
| `cart_items` | `added_at` | `DATETIME(3)` | No | Current time | Lifecycle. |
| `applied_cart_coupons` | `cart_id` | `BIGINT UNSIGNED` | No | None | FK Cart. |
| `applied_cart_coupons` | `coupon_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Coupon nullable. |
| `applied_cart_coupons` | `coupon_code_snapshot` | `VARCHAR(64)` | No | None | Snapshot. |
| `applied_cart_coupons` | `discount_snapshot` | `DECIMAL(12,2)` | Yes | `NULL` | Snapshot. |
| `applied_cart_coupons` | `validation_status` | `VARCHAR(32)` | No | `valid` | valid/invalid/removed. |
| `applied_cart_coupons` | `applied_at` | `DATETIME(3)` | No | Current time | Lifecycle. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `carts` | `id` | `customer_profile_id` | One active cart per customer by migration rule | guest needs `guest_session_reference` | `idx_carts_customer_status`, `idx_carts_guest_status`, `idx_carts_status_updated` |
| `cart_items` | `id` | `cart_id`, `product_id` | `(tenant_id, cart_id, product_id, item_status)` | `quantity > 0`, price >= 0 if not null | `idx_cart_items_cart`, `idx_cart_items_product` |
| `applied_cart_coupons` | `id` | `cart_id`, `coupon_id` | `(tenant_id, cart_id, coupon_code_snapshot, validation_status)` | discount >= 0 if not null | `idx_applied_cart_coupons_cart`, `idx_applied_cart_coupons_coupon` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: Không dùng.
- Generated Column: Không dùng.

## FK Delete Rule / Quy tắc xóa FK

- Cart -> items/coupons: Restrict với checked_out cart; abandoned/expired có thể purge theo retention.
- Product/Coupon references: Restrict hoặc Set Null với coupon optional nếu coupon bị archived.

## Performance & Retention / Hiệu năng và lưu giữ

- Active cart lookup theo customer hoặc guest session.
- Abandoned/expired cart archive/purge theo retention để giảm bảng.
