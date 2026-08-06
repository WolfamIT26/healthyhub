# Order Physical Database / Database vật lý domain đơn hàng

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `orders` | Đơn hàng chính và snapshot trạng thái. |
| `order_items` | Dòng sản phẩm với snapshot. |
| `order_status_histories` | Lịch sử trạng thái đơn. |
| `order_cancellations` | Thông tin hủy đơn. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `orders` | `customer_profile_id` | `BIGINT UNSIGNED` | No | None | FK Customer. |
| `orders` | `cart_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Cart. |
| `orders` | `order_code` | `VARCHAR(64)` | No | None | Unique. |
| `orders` | `order_source` | `VARCHAR(32)` | No | `web` | web/admin/mobile future. |
| `orders` | `order_status` | `VARCHAR(32)` | No | `new` | lifecycle. |
| `orders` | `payment_status_snapshot` | `VARCHAR(32)` | No | `pending` | Snapshot. |
| `orders` | `shipping_status_snapshot` | `VARCHAR(32)` | No | `pending` | Snapshot. |
| `orders` | `order_total` | `DECIMAL(12,2)` | No | `0.00` | Total. |
| `orders` | `placed_at` | `DATETIME(3)` | No | Current time | Order time. |
| `orders` | `completed_at` | `DATETIME(3)` | Yes | `NULL` | Completed marker. |
| `order_items` | `order_id` | `BIGINT UNSIGNED` | No | None | FK Order. |
| `order_items` | `product_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Product nullable for history. |
| `order_items` | `product_name_snapshot` | `VARCHAR(255)` | No | None | Snapshot. |
| `order_items` | `sku_snapshot` | `VARCHAR(64)` | Yes | `NULL` | Product code snapshot. |
| `order_items` | `unit_price_snapshot` | `DECIMAL(12,2)` | No | None | Money. |
| `order_items` | `quantity` | `INT UNSIGNED` | No | None | > 0. |
| `order_items` | `line_total` | `DECIMAL(12,2)` | No | None | Snapshot total. |
| `order_items` | `item_status` | `VARCHAR(32)` | No | `active` | active/cancelled/refunded. |
| `order_status_histories` | `order_id` | `BIGINT UNSIGNED` | No | None | FK Order. |
| `order_status_histories` | `from_status` | `VARCHAR(32)` | Yes | `NULL` | Previous. |
| `order_status_histories` | `to_status` | `VARCHAR(32)` | No | None | New. |
| `order_status_histories` | `reason` | `VARCHAR(500)` | Yes | `NULL` | Reason. |
| `order_status_histories` | `changed_at` | `DATETIME(3)` | No | Current time | Audit. |
| `order_status_histories` | `changed_by` | `BIGINT UNSIGNED` | Yes | `NULL` | FK User. |
| `order_cancellations` | `order_id` | `BIGINT UNSIGNED` | No | None | FK Order. |
| `order_cancellations` | `cancellation_type` | `VARCHAR(32)` | No | None | customer/staff/system. |
| `order_cancellations` | `cancellation_reason` | `VARCHAR(500)` | No | None | Required. |
| `order_cancellations` | `cancelled_at` | `DATETIME(3)` | No | Current time | Cancel time. |
| `order_cancellations` | `cancelled_by` | `BIGINT UNSIGNED` | Yes | `NULL` | FK User. |
| `order_cancellations` | `cancellation_status` | `VARCHAR(32)` | No | `requested` | requested/approved/rejected/completed. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `orders` | `id` | `customer_profile_id`, `cart_id` | `(tenant_id, order_code)` | `order_total >= 0` | `idx_orders_customer_time`, `idx_orders_status_time`, `idx_orders_payment_shipping` |
| `order_items` | `id` | `order_id`, `product_id` | None | quantity > 0, amounts >= 0 | `idx_order_items_order`, `idx_order_items_product` |
| `order_status_histories` | `id` | `order_id`, `changed_by` | None | `to_status` allowed | `idx_order_status_order_time`, `idx_order_status_changed_at` |
| `order_cancellations` | `id` | `order_id`, `cancelled_by` | One active cancellation per order by migration rule | reason required | `idx_order_cancellations_order_status` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: Không dùng mặc định.
- Generated Column: Có thể tạo date bucket từ `placed_at` cho báo cáo sau này, chưa bắt buộc MVP.

## FK Delete Rule / Quy tắc xóa FK

- Order -> items/history/cancellation: Restrict; không hard delete order.
- Product FK trong order item: Set Null nếu product bị hard delete theo privacy/admin policy, snapshot vẫn giữ.
- Actor FKs: Set Null.

## Performance & Retention / Hiệu năng và lưu giữ

- Order list query theo customer/status/time cần composite index.
- `order_status_histories` là ứng viên partition/archive theo `changed_at`.
