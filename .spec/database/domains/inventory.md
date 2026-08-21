# Inventory Database / Database domain tồn kho

## Storage Purpose / Mục đích lưu trữ

Lưu khả năng bán của sản phẩm, điều chỉnh tồn, cảnh báo tồn kho và reservation để tránh oversell trong luồng đặt hàng.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `inventory_items` | Trạng thái tồn kho logic của product. |
| `stock_adjustments` | Lịch sử điều chỉnh tồn. |
| `stock_alerts` | Cảnh báo gần hết/hết hàng. |
| `stock_reservations` | Giữ hàng tạm cho cart/order. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `inventory_items` | `id` | `tenant_id`, `available_quantity`, `reserved_quantity`, `stock_threshold`, `stock_status`, `version` | `product_id` -> Product | available, low_stock, out_of_stock, disabled |
| `stock_adjustments` | `id` | `tenant_id`, `adjustment_type`, `quantity_delta`, `adjustment_reason`, `adjusted_at` | `inventory_item_id`, `adjusted_by` -> User | recorded, reversed |
| `stock_alerts` | `id` | `tenant_id`, `alert_type`, `alert_status`, `triggered_at`, `resolved_at` | `inventory_item_id` | open, acknowledged, resolved |
| `stock_reservations` | `id` | `tenant_id`, `reserved_quantity`, `reservation_status`, `reserved_at`, `consumed_at`, `released_at`, `reacquired_at`, `restocked_at` | `inventory_item_id`, `order_id` -> Order | active, consumed, released, restocked |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: MVP ưu tiên một `inventory_item` cho một product.
- 1-N: Một inventory item có nhiều adjustment, alert và reservation.
- N-N: Không có N-N trực tiếp trong MVP; multi-location tương lai có thể thêm location association.
- Cardinality: Executable reservation luôn gắn một Order và một inventory item; unique tenant/Order/item tạo một business identity.

## Business Constraints / Ràng buộc nghiệp vụ

- Không được để available quantity logic âm.
- OrderPlaced phải reserve stock trong cùng transaction tạo Order.
- COD consume ngay tại OrderPlaced; verified VNPAY paid consume, failed/cancelled release.
- Future Order cancellation trước consume dùng release; cancellation/refund sau consume dùng restock.

## Delete Strategy / Chiến lược xóa

- Inventory item dùng disabled khi product không bán.
- Adjustment và reservation giữ lịch sử, không hard delete trong vận hành thường ngày.
- Alert có thể resolved, không cần xóa.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Adjustment cần `adjusted_by`, `adjustment_reason`; reservation cần context order/cart.

## Data Lifecycle / Vòng đời dữ liệu

Inventory item tạo khi product có thể bán, cập nhật qua adjustment/reservation, phát cảnh báo khi dưới ngưỡng, disabled khi ngừng bán.

## Data Ownership / Sở hữu dữ liệu

Inventory domain sở hữu số lượng và khả năng bán. Product chỉ sở hữu thông tin catalog.

## Data Validation / Validation dữ liệu

- `available_quantity` và `reserved_quantity` không âm.
- `stock_threshold` không âm.
- VNPAY pending không có Inventory TTL độc lập khi Payment chưa có authoritative timeout transition.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `available_quantity` | `inventory_items` | Số lượng có thể bán logic. | Không âm. |
| `reserved_quantity` | `inventory_items` | Số lượng đang giữ tạm. | Không âm, không vượt tổng logic. |
| `stock_status` | `inventory_items` | Trạng thái tồn kho. | available, low_stock, out_of_stock, disabled. |
| `quantity_delta` | `stock_adjustments` | Chênh lệch điều chỉnh. | Khác 0, có lý do. |
| `reservation_status` | `stock_reservations` | Trạng thái giữ hàng. | active, consumed, released, restocked. |

## Prompt 32.1 Executable Persistence / Persistence chạy Prompt 32.1

`inventory_items` tiếp tục là quantity authority. `stock_reservations` là durable Order lifecycle/idempotency record, unique `(tenant_id, order_id, inventory_item_id)` và không tạo quantity authority song song. `stock_adjustments`/`stock_alerts` vẫn design-only vì Admin adjustment/alert chưa thuộc scope.
