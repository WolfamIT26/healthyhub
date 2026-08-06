# Coupons Feature Specification / Đặc tả tính năng mã giảm giá

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1 |
| Dependency | Cart, Orders, Promotions, Customers |
| Version | Version 1 |
| Owner | Marketing, Manager |
| Status | Draft for business specification |

## Overview / Tổng quan

Coupons cho phép cửa hàng tạo mã giảm giá có điều kiện để thúc đẩy mua hàng.

## Business Goal / Mục tiêu kinh doanh

Tăng tỷ lệ chuyển đổi, hỗ trợ chiến dịch marketing và chăm sóc khách hàng theo nhóm.

## Scope / Phạm vi

Trong phạm vi: mã giảm giá, thời gian hiệu lực, điều kiện áp dụng, giới hạn sử dụng, kiểm tra trong cart/order. Ngoài phạm vi: API coupon, database coupon, thuật toán tối ưu khuyến mãi.

## Requirement / Yêu cầu

- Coupon có mã, thời gian và điều kiện rõ.
- Coupon có thể giới hạn theo đơn, sản phẩm, khách hoặc chiến dịch.
- Coupon phải được xác nhận lại trước khi tạo order.
- Coupon hết hạn hoặc vượt giới hạn không được áp dụng.

## User Story / User story

- Là Customer, tôi muốn nhập mã giảm giá để tiết kiệm chi phí.
- Là Manager, tôi muốn tạo coupon có điều kiện rõ.
- Là Marketing, tôi muốn đo hiệu quả coupon trong chiến dịch.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Apply coupon | Customer | Giỏ hàng có ưu đãi hợp lệ. |
| Create coupon | Manager | Coupon sẵn sàng cho chiến dịch. |
| Disable coupon | Manager | Coupon không còn áp dụng. |

## Business Flow / Luồng nghiệp vụ

1. Manager tạo coupon và điều kiện.
2. Customer nhập coupon trong cart hoặc checkout.
3. Hệ thống kiểm tra điều kiện áp dụng.
4. Nếu hợp lệ, ưu đãi được tính ở mức nghiệp vụ.
5. Trước khi tạo order, coupon được kiểm tra lại.

## Validation Rule / Quy tắc validation

- Coupon phải còn hiệu lực.
- Coupon không vượt giới hạn sử dụng.
- Coupon không áp dụng cho sản phẩm/khách không đủ điều kiện.
- Rule cộng dồn với promotion cần rõ.

## Permission / Phân quyền

Customer áp dụng coupon. Manager/Admin tạo, sửa, vô hiệu hóa coupon. Staff chỉ xem khi hỗ trợ đơn.

## Acceptance Criteria / Tiêu chí hoàn thành

- Coupon có điều kiện rõ.
- Coupon được kiểm tra ở cart và order.
- Coupon hết hạn không áp dụng.
- Manager có thể kiểm soát trạng thái coupon.

## Edge Cases / Trường hợp biên

- Coupon hết hạn trong lúc checkout.
- Một khách dùng lại coupon vượt giới hạn.
- Coupon áp dụng cùng promotion.
- Coupon chỉ dành cho VIP.

## Error Cases / Trường hợp lỗi

- Coupon không tồn tại.
- Coupon hết hạn.
- Coupon không đủ điều kiện.
- Coupon đã vượt giới hạn.

## Future Enhancement / Mở rộng tương lai

- Personalized coupon.
- Coupon campaign analytics.
- Auto coupon suggestion.

