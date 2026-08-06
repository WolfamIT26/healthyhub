# Cart Domain / Domain giỏ hàng

## Purpose / Mục đích

Quản lý danh sách sản phẩm khách muốn mua trước khi tạo đơn hàng.

## Responsibility / Trách nhiệm

- Thêm, xóa, cập nhật sản phẩm trong giỏ.
- Kiểm tra sản phẩm, tồn kho, giá/ưu đãi ở mức nghiệp vụ trước khi đặt hàng.
- Hỗ trợ cart tạm cho Guest nếu policy cho phép.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `Cart`
- Entity: `CartItem`, `AppliedCartCoupon`
- Value Object: `CartOwner`, `CartQuantity`, `CartValidationResult`
- Enum: `CartStatus`, `CartItemStatus`, `CartValidationStatus`

## Relationships / Quan hệ với domain khác

- Phụ thuộc Product, Inventory và Coupon.
- Order được tạo từ Cart hợp lệ.
- Customer sở hữu cart khi đăng nhập.

## Business Rule / Quy tắc nghiệp vụ

- Cart phải kiểm tra lại khả năng bán trước khi đặt hàng.
- Số lượng sản phẩm phải hợp lệ.
- Coupon trong cart chỉ là dự kiến cho đến khi tạo order.
- Sản phẩm hết hàng phải được cảnh báo.

## Domain Event / Sự kiện domain

- `ItemAddedToCart`
- `CartItemQuantityChanged`
- `CartValidated`
- `CartConvertedToOrder`

## Dependency / Phụ thuộc

- Core dependency: Product, Inventory, Coupon
- Downstream: Order

## Boundary / Ranh giới

Cart không sở hữu order, payment hoặc shipping. Khi chuyển thành Order, quyền điều phối chuyển sang Order domain.

