# Order Database / Database domain đơn hàng

## Storage Purpose / Mục đích lưu trữ

Lưu đơn hàng, dòng sản phẩm, trạng thái xử lý và lý do hủy để bảo toàn lịch sử mua hàng và điều phối payment, shipping, inventory.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `orders` | Đơn hàng chính. |
| `order_items` | Dòng sản phẩm trong đơn, có snapshot dữ liệu. |
| `order_status_histories` | Lịch sử chuyển trạng thái đơn. |
| `order_cancellations` | Thông tin hủy đơn. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `orders` | `id` | `tenant_id`, `order_code`, `order_source`, `order_status`, `payment_status_snapshot`, `shipping_status_snapshot`, `order_total`, `placed_at`, `completed_at` | `customer_profile_id` -> Customer, `cart_id` -> Cart nullable | new, confirmed, processing, shipped, completed, cancelled |
| `order_items` | `id` | `tenant_id`, `product_name_snapshot`, `sku_snapshot`, `unit_price_snapshot`, `quantity`, `line_total` | `order_id`, `product_id` -> Product nullable | active, cancelled, refunded |
| `order_status_histories` | `id` | `tenant_id`, `from_status`, `to_status`, `reason`, `changed_at` | `order_id`, `changed_by` -> User nullable | recorded |
| `order_cancellations` | `id` | `tenant_id`, `cancellation_type`, `cancellation_reason`, `cancelled_at` | `order_id`, `cancelled_by` -> User nullable | requested, approved, rejected, completed |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Một order có thể có 0-1 cancellation completed.
- 1-N: Một customer có nhiều order; một order có nhiều item và status history.
- N-N: Order và Product qua `order_items`.
- Cardinality: Order phải có ít nhất một order item hợp lệ.

## Business Constraints / Ràng buộc nghiệp vụ

- Order không chuyển trạng thái ngoài flow hợp lệ.
- Order completed cần đủ điều kiện payment/shipping theo policy.
- Order cancelled phải có reason để chăm sóc khách và analytics.
- Order item cần snapshot giá/tên sản phẩm tại thời điểm đặt.

## Delete Strategy / Chiến lược xóa

- Order và order item không hard delete trong vận hành thường ngày.
- Order dùng trạng thái cancelled/archived theo retention.
- Status history giữ audit đầy đủ.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Status history cần `changed_by`, `reason`, `changed_at`.

## Data Lifecycle / Vòng đời dữ liệu

Order được tạo từ cart/checkout, confirmed, processing, shipped, completed hoặc cancelled. Payment và Shipping cập nhật snapshot trạng thái theo event/contract.

## Data Ownership / Sở hữu dữ liệu

Order domain sở hữu lifecycle đơn hàng và snapshot đơn. Payment/Shipping sở hữu trạng thái chi tiết của thanh toán/giao hàng.

## Data Validation / Validation dữ liệu

- `order_code` unique theo tenant.
- `quantity` lớn hơn 0.
- `order_total` phải khớp tổng line/discount/shipping logic ở thời điểm checkout.
- Transition status phải hợp lệ.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `order_code` | `orders` | Mã đơn hàng cho vận hành. | Unique theo tenant. |
| `order_status` | `orders` | Trạng thái xử lý đơn. | Theo flow hợp lệ. |
| `order_total` | `orders` | Tổng giá trị đơn. | Không âm, tính từ snapshot. |
| `product_name_snapshot` | `order_items` | Tên product tại thời điểm đặt. | Không đổi theo product hiện tại. |
| `cancellation_reason` | `order_cancellations` | Lý do hủy. | Bắt buộc khi hủy. |
