# Cart Database / Database domain giỏ hàng

## Storage Purpose / Mục đích lưu trữ

Lưu giỏ hàng, sản phẩm trong giỏ và coupon đang áp dụng để chuẩn bị đặt hàng và kiểm tra lại giá/tồn kho trước checkout.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `carts` | Giỏ hàng của khách hoặc guest session. |
| `cart_items` | Dòng sản phẩm trong giỏ. |
| `applied_cart_coupons` | Coupon được áp vào giỏ. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `carts` | `id` | `tenant_id`, `cart_owner_type`, `guest_session_reference`, `cart_status`, `cart_validation_status`, `last_validated_at` | `customer_profile_id` -> Customer nullable | active, checked_out, abandoned, expired |
| `cart_items` | `id` | `tenant_id`, `quantity`, `item_price_snapshot`, `item_status`, `added_at` | `cart_id`, `product_id` -> Product | active, unavailable, removed |
| `applied_cart_coupons` | `id` | `tenant_id`, `coupon_code_snapshot`, `discount_snapshot`, `validation_status`, `applied_at` | `cart_id`, `coupon_id` -> Coupon nullable | valid, invalid, removed |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Một customer nên có tối đa một active cart theo tenant.
- 1-N: Một cart có nhiều cart item và coupon applied.
- N-N: Cart và Product qua `cart_items`; Cart và Coupon qua `applied_cart_coupons`.
- Cardinality: Cart item phải tham chiếu product active ở thời điểm thêm, nhưng cần validate lại khi checkout.

## Business Constraints / Ràng buộc nghiệp vụ

- Cart phải kiểm tra lại tồn kho, giá và coupon trước khi tạo order.
- Sản phẩm hết hàng không được checkout như còn hàng.
- Guest cart cần session reference nếu chưa có customer.

## Delete Strategy / Chiến lược xóa

- Cart active/abandoned có thể expired theo retention.
- Cart checked out không hard delete ngay vì liên quan order trace.
- Cart item removed giữ tối thiểu đến khi cart hết lifecycle.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Với guest cart, `created_by` có thể nullable.

## Data Lifecycle / Vòng đời dữ liệu

Cart tạo khi khách thêm sản phẩm, cập nhật item/coupon, validate trước checkout, chuyển checked_out hoặc abandoned/expired.

## Data Ownership / Sở hữu dữ liệu

Cart domain sở hữu dữ liệu giỏ hàng tạm. Order sẽ sở hữu dữ liệu đơn hàng sau checkout.

## Data Validation / Validation dữ liệu

- `quantity` lớn hơn 0.
- Không trùng active `product_id` trong cùng cart nếu không có biến thể.
- Coupon phải validate lại ở thời điểm checkout.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `cart_owner_type` | `carts` | Loại chủ giỏ hàng. | guest, customer. |
| `guest_session_reference` | `carts` | Tham chiếu session guest. | Bắt buộc nếu guest. |
| `quantity` | `cart_items` | Số lượng muốn mua. | Lớn hơn 0. |
| `item_price_snapshot` | `cart_items` | Giá tại lần validate gần nhất. | Không dùng làm giá cuối nếu chưa revalidate. |
| `validation_status` | `applied_cart_coupons` | Trạng thái coupon trong cart. | valid, invalid, removed. |
