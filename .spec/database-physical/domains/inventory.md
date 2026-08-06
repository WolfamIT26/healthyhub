# Inventory Physical Database / Database vật lý domain tồn kho

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `inventory_items` | Tồn kho logic theo product. |
| `stock_adjustments` | Lịch sử điều chỉnh tồn. |
| `stock_alerts` | Cảnh báo tồn kho. |
| `stock_reservations` | Giữ hàng tạm cho cart/order. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `inventory_items` | `product_id` | `BIGINT UNSIGNED` | No | None | FK Product. |
| `inventory_items` | `available_quantity` | `INT UNSIGNED` | No | `0` | Số lượng có thể bán. |
| `inventory_items` | `reserved_quantity` | `INT UNSIGNED` | No | `0` | Đang giữ. |
| `inventory_items` | `stock_threshold` | `INT UNSIGNED` | No | `0` | Ngưỡng cảnh báo. |
| `inventory_items` | `stock_status` | `VARCHAR(32)` | No | `available` | available/low_stock/out_of_stock/disabled. |
| `stock_adjustments` | `inventory_item_id` | `BIGINT UNSIGNED` | No | None | FK Inventory. |
| `stock_adjustments` | `adjustment_type` | `VARCHAR(32)` | No | None | increase/decrease/correction/reverse. |
| `stock_adjustments` | `quantity_delta` | `INT` | No | None | Có thể âm/dương. |
| `stock_adjustments` | `adjustment_reason` | `VARCHAR(500)` | No | None | Required. |
| `stock_adjustments` | `adjusted_at` | `DATETIME(3)` | No | Current time | Audit nghiệp vụ. |
| `stock_adjustments` | `adjusted_by` | `BIGINT UNSIGNED` | Yes | `NULL` | FK User. |
| `stock_alerts` | `inventory_item_id` | `BIGINT UNSIGNED` | No | None | FK Inventory. |
| `stock_alerts` | `alert_type` | `VARCHAR(32)` | No | None | low_stock/out_of_stock. |
| `stock_alerts` | `alert_status` | `VARCHAR(32)` | No | `open` | open/acknowledged/resolved. |
| `stock_alerts` | `triggered_at` | `DATETIME(3)` | No | Current time | Trigger. |
| `stock_alerts` | `resolved_at` | `DATETIME(3)` | Yes | `NULL` | Resolve. |
| `stock_reservations` | `inventory_item_id` | `BIGINT UNSIGNED` | No | None | FK Inventory. |
| `stock_reservations` | `order_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Order nullable. |
| `stock_reservations` | `cart_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Cart nullable. |
| `stock_reservations` | `reserved_quantity` | `INT UNSIGNED` | No | None | Lớn hơn 0. |
| `stock_reservations` | `reservation_status` | `VARCHAR(32)` | No | `active` | active/consumed/released/expired. |
| `stock_reservations` | `reserved_at` | `DATETIME(3)` | No | Current time | Start. |
| `stock_reservations` | `expires_at` | `DATETIME(3)` | Yes | `NULL` | Expiry. |
| `stock_reservations` | `released_at` | `DATETIME(3)` | Yes | `NULL` | Release. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `inventory_items` | `id` | `product_id` -> `products.id` | `(tenant_id, product_id)` | quantities >= 0 | `idx_inventory_status`, `idx_inventory_product_status` |
| `stock_adjustments` | `id` | `inventory_item_id`, `adjusted_by` | None | `quantity_delta <> 0` | `idx_stock_adjustments_item_time`, `idx_stock_adjustments_type_time` |
| `stock_alerts` | `id` | `inventory_item_id` | One open alert per item/type by migration rule | `resolved_at` null hoặc sau `triggered_at` | `idx_stock_alerts_status_time` |
| `stock_reservations` | `id` | `inventory_item_id`, `order_id`, `cart_id` | None | `reserved_quantity > 0`, exactly one context if enforced | `idx_stock_reservations_item_status`, `idx_stock_reservations_order`, `idx_stock_reservations_cart`, `idx_stock_reservations_expires` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: Không dùng.
- Generated Column: Không dùng.

## FK Delete Rule / Quy tắc xóa FK

- Product -> inventory item: Restrict khi product đã active.
- Inventory item -> adjustments/reservations: Restrict.
- Actor `adjusted_by`: Set Null.

## Performance & Retention / Hiệu năng và lưu giữ

- Checkout cần index nhanh theo `product_id` và `stock_status`.
- `stock_adjustments` và `stock_reservations` có thể archive theo thời gian khi lớn.
