# Cart Feature Specification / Đặc tả tính năng giỏ hàng

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | MVP |
| Dependency | Products, Inventory, Coupons |
| Version | MVP |
| Owner | Product Owner |
| Status | Draft for business specification |

## Overview / Tổng quan

Cart lưu danh sách sản phẩm khách muốn mua trước khi đặt hàng và kiểm tra lại điều kiện mua trước khi tạo đơn.

## Business Goal / Mục tiêu kinh doanh

Giúp khách gom sản phẩm, xem tổng quan đơn dự kiến và giảm lỗi khi chuyển sang đặt hàng.

## Scope / Phạm vi

Trong phạm vi: thêm/xóa/cập nhật sản phẩm trong giỏ, giỏ hàng tạm cho Guest, kiểm tra tồn kho và ưu đãi trước đặt hàng. Ngoài phạm vi: API cart, database cart, UI giỏ hàng.

## Requirement / Yêu cầu

- Guest có thể dùng cart giới hạn theo chính sách.
- Customer có cart gắn tài khoản.
- Cart phải kiểm tra lại giá, tồn kho và coupon trước khi đặt hàng.
- Sản phẩm hết hàng phải được cảnh báo trong cart.

## User Story / User story

- Là Guest, tôi muốn thêm sản phẩm vào giỏ trước khi đăng nhập.
- Là Customer, tôi muốn chỉnh số lượng sản phẩm trong giỏ.
- Là Customer, tôi muốn biết sản phẩm trong giỏ còn mua được không.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Add to cart | Guest, Customer | Sản phẩm được thêm vào giỏ. |
| Update quantity | Customer | Số lượng dự kiến được cập nhật. |
| Remove item | Guest, Customer | Sản phẩm bị xóa khỏi giỏ. |
| Validate cart | Customer | Giỏ đủ điều kiện đặt hàng hoặc báo lỗi. |

## Business Flow / Luồng nghiệp vụ

1. Khách chọn sản phẩm.
2. Khách thêm sản phẩm vào giỏ.
3. Khách điều chỉnh số lượng hoặc coupon.
4. Hệ thống kiểm tra sản phẩm, tồn kho và ưu đãi.
5. Giỏ hợp lệ được chuyển sang đặt hàng.

## Validation Rule / Quy tắc validation

- Số lượng phải lớn hơn 0.
- Sản phẩm phải đang được phép bán.
- Coupon trong cart chỉ là dự kiến cho đến bước đặt hàng.
- Cart phải được kiểm tra lại trước khi tạo order.

## Permission / Phân quyền

Guest dùng cart tạm. Customer dùng cart cá nhân. Staff/Admin không đặt hàng thay khách trong MVP trừ khi có policy sau này.

## Acceptance Criteria / Tiêu chí hoàn thành

- Khách có thể thêm, sửa, xóa sản phẩm trong giỏ.
- Giỏ cảnh báo sản phẩm hết hàng hoặc không hợp lệ.
- Giá/ưu đãi được xác nhận lại trước đặt hàng.
- Guest cart không vượt chính sách.

## Edge Cases / Trường hợp biên

- Sản phẩm hết hàng sau khi thêm vào giỏ.
- Coupon hết hạn trước khi đặt hàng.
- Guest đăng nhập và cần đồng bộ cart.

## Error Cases / Trường hợp lỗi

- Sản phẩm không còn public.
- Số lượng không hợp lệ.
- Coupon không áp dụng.

## Future Enhancement / Mở rộng tương lai

- Saved cart.
- Cart recovery notification.
- Staff-assisted order.

