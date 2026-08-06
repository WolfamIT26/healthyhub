# Shipping Physical Database / Database vật lý domain giao hàng

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `shipments` | Thông tin giao hàng theo order. |
| `shipping_addresses` | Địa chỉ giao hàng snapshot. |
| `delivery_attempts` | Lần giao hàng. |
| `shipping_status_histories` | Lịch sử trạng thái giao hàng. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `shipments` | `order_id` | `BIGINT UNSIGNED` | No | None | FK Order. |
| `shipments` | `shipping_method` | `VARCHAR(64)` | No | `manual` | manual/provider future. |
| `shipments` | `shipping_fee` | `DECIMAL(12,2)` | No | `0.00` | Money. |
| `shipments` | `shipping_status` | `VARCHAR(32)` | No | `pending` | pending/preparing/shipped/delivered/failed/returned. |
| `shipments` | `tracking_reference` | `VARCHAR(191)` | Yes | `NULL` | Provider reference. |
| `shipments` | `shipped_at` | `DATETIME(3)` | Yes | `NULL` | Shipped marker. |
| `shipments` | `delivered_at` | `DATETIME(3)` | Yes | `NULL` | Delivered marker. |
| `shipping_addresses` | `shipment_id` | `BIGINT UNSIGNED` | No | None | FK Shipment. |
| `shipping_addresses` | `customer_address_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Customer address optional. |
| `shipping_addresses` | `recipient_name` | `VARCHAR(255)` | No | None | Snapshot. |
| `shipping_addresses` | `recipient_phone` | `VARCHAR(32)` | No | None | Snapshot. |
| `shipping_addresses` | `address_text` | `TEXT` | No | None | Snapshot. |
| `shipping_addresses` | `delivery_note` | `VARCHAR(500)` | Yes | `NULL` | Note. |
| `shipping_addresses` | `address_snapshot_status` | `VARCHAR(32)` | No | `active` | active/corrected. |
| `delivery_attempts` | `shipment_id` | `BIGINT UNSIGNED` | No | None | FK Shipment. |
| `delivery_attempts` | `attempt_no` | `INT UNSIGNED` | No | `1` | Attempt number. |
| `delivery_attempts` | `attempt_status` | `VARCHAR(32)` | No | `scheduled` | scheduled/success/failed. |
| `delivery_attempts` | `failure_reason` | `VARCHAR(500)` | Yes | `NULL` | Required when failed. |
| `delivery_attempts` | `attempted_at` | `DATETIME(3)` | No | Current time | Attempt. |
| `shipping_status_histories` | `shipment_id` | `BIGINT UNSIGNED` | No | None | FK Shipment. |
| `shipping_status_histories` | `from_status` | `VARCHAR(32)` | Yes | `NULL` | Previous. |
| `shipping_status_histories` | `to_status` | `VARCHAR(32)` | No | None | New. |
| `shipping_status_histories` | `reason` | `VARCHAR(500)` | Yes | `NULL` | Reason. |
| `shipping_status_histories` | `changed_at` | `DATETIME(3)` | No | Current time | Audit. |
| `shipping_status_histories` | `changed_by` | `BIGINT UNSIGNED` | Yes | `NULL` | FK User. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `shipments` | `id` | `order_id` | None | `shipping_fee >= 0` | `idx_shipments_order_status`, `idx_shipments_status_time`, `idx_shipments_tracking` |
| `shipping_addresses` | `id` | `shipment_id`, `customer_address_id` | One active address snapshot per shipment by migration rule | recipient fields required | `idx_shipping_addresses_shipment` |
| `delivery_attempts` | `id` | `shipment_id` | `(tenant_id, shipment_id, attempt_no)` | attempt_no > 0 | `idx_delivery_attempts_shipment_time`, `idx_delivery_attempts_status_time` |
| `shipping_status_histories` | `id` | `shipment_id`, `changed_by` | None | `to_status` allowed | `idx_shipping_status_shipment_time` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: Không dùng.
- Generated Column: Không dùng.

## FK Delete Rule / Quy tắc xóa FK

- Order -> shipment: Restrict.
- Shipment -> address/attempt/history: Restrict.
- Customer address reference: Set Null nếu address gốc bị xóa mềm/hard delete; snapshot vẫn giữ.
- Actor FKs: Set Null.

## Performance & Retention / Hiệu năng và lưu giữ

- Shipping list query theo order/status/time.
- Delivery attempts và history archive theo thời gian khi lớn.
