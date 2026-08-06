# Shipping Database / Database domain giao hàng

## Storage Purpose / Mục đích lưu trữ

Lưu shipment, địa chỉ giao hàng snapshot, lần giao và lịch sử trạng thái giao hàng để hỗ trợ xử lý order và chăm sóc khách.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `shipments` | Bản ghi giao hàng theo order. |
| `shipping_addresses` | Địa chỉ nhận hàng snapshot. |
| `delivery_attempts` | Lần giao hàng. |
| `shipping_status_histories` | Lịch sử trạng thái giao hàng. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `shipments` | `id` | `tenant_id`, `shipping_method`, `shipping_fee`, `shipping_status`, `tracking_reference`, `shipped_at`, `delivered_at` | `order_id` -> Order | pending, preparing, shipped, delivered, failed, returned |
| `shipping_addresses` | `id` | `tenant_id`, `recipient_name`, `recipient_phone`, `address_text`, `delivery_note`, `address_snapshot_status` | `shipment_id`, `customer_address_id` -> Customer nullable | active, corrected |
| `delivery_attempts` | `id` | `tenant_id`, `attempt_no`, `attempt_status`, `failure_reason`, `attempted_at` | `shipment_id` | scheduled, success, failed |
| `shipping_status_histories` | `id` | `tenant_id`, `from_status`, `to_status`, `reason`, `changed_at` | `shipment_id`, `changed_by` -> User nullable | recorded |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Một shipment có một shipping address snapshot chính.
- 1-N: Một order có thể có nhiều shipment; một shipment có nhiều attempt/history.
- N-N: Không có N-N trực tiếp.
- Cardinality: MVP có thể dùng một shipment cho một order, nhưng logical model cho phép tách shipment sau này.

## Business Constraints / Ràng buộc nghiệp vụ

- Địa chỉ nhận hàng phải đủ thông tin để giao.
- Phí giao hàng cần xác nhận trước khi order hoàn tất.
- Thay đổi địa chỉ sau xử lý cần quyền và reason.

## Delete Strategy / Chiến lược xóa

- Shipment và address snapshot không hard delete nếu gắn order.
- Delivery attempt/history giữ audit giao hàng.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Status history cần `changed_by`, `reason`, `changed_at`.

## Data Lifecycle / Vòng đời dữ liệu

Shipment tạo sau order, pending/preparing, shipped, delivered hoặc failed/returned. Address snapshot được giữ ổn định theo đơn.

## Data Ownership / Sở hữu dữ liệu

Shipping domain sở hữu shipment và address snapshot. Customer domain sở hữu address gốc trong hồ sơ khách.

## Data Validation / Validation dữ liệu

- `recipient_name`, `recipient_phone`, `address_text` bắt buộc.
- `shipping_fee` không âm.
- `attempt_no` tăng theo shipment.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `shipping_method` | `shipments` | Phương thức giao hàng. | Theo settings/shipping policy. |
| `shipping_fee` | `shipments` | Phí giao hàng đã xác nhận. | Không âm. |
| `tracking_reference` | `shipments` | Mã theo dõi provider future. | Không chứa secret. |
| `address_text` | `shipping_addresses` | Địa chỉ snapshot. | Đủ thông tin giao. |
| `failure_reason` | `delivery_attempts` | Lý do giao thất bại. | Bắt buộc khi failed. |
