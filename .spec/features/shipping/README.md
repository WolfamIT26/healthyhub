# Shipping Feature Specification / Đặc tả tính năng giao hàng

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1 |
| Dependency | Orders, Customers, Notification |
| Version | Version 1 |
| Owner | Operations Manager |
| Status | Draft for business specification |

## Overview / Tổng quan

Shipping quản lý thông tin nhận hàng, trạng thái giao và chính sách phí giao hàng ở mức nghiệp vụ.

## Business Goal / Mục tiêu kinh doanh

Giúp đơn hàng được giao đúng thông tin, khách theo dõi được trạng thái và staff xử lý giao hàng ít sai sót.

## Scope / Phạm vi

Trong phạm vi: địa chỉ nhận hàng, người nhận, phí giao hàng nghiệp vụ, trạng thái giao, ghi chú giao hàng. Ngoài phạm vi: shipping provider API, route optimization, database shipping.

## Requirement / Yêu cầu

- Đơn cần thông tin nhận hàng đủ để giao.
- Phí giao hàng cần được xác nhận trước khi đặt.
- Staff cập nhật trạng thái giao hàng theo quyền.
- Thay đổi địa chỉ sau khi đặt cần rule rõ.

## User Story / User story

- Là Customer, tôi muốn nhập địa chỉ nhận hàng chính xác.
- Là Staff, tôi muốn cập nhật trạng thái giao.
- Là Manager, tôi muốn kiểm soát đơn giao lỗi.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Enter shipping info | Customer | Đơn có thông tin giao hàng. |
| Update delivery status | Staff | Trạng thái giao được cập nhật. |
| Handle failed delivery | Staff, Manager | Đơn có hướng xử lý tiếp. |

## Business Flow / Luồng nghiệp vụ

1. Customer nhập thông tin nhận hàng.
2. Hệ thống kiểm tra dữ liệu bắt buộc.
3. Phí giao hàng được xác nhận ở mức nghiệp vụ.
4. Staff xử lý giao và cập nhật trạng thái.
5. Nếu giao lỗi, staff ghi lý do và hướng xử lý.

## Validation Rule / Quy tắc validation

- Địa chỉ phải đủ thông tin tối thiểu.
- Số điện thoại người nhận phải hợp lệ.
- Thay đổi địa chỉ sau khi xử lý cần quyền.
- Trạng thái giao không được nhảy sai luồng.

## Permission / Phân quyền

Customer nhập và xem thông tin giao của đơn mình. Staff cập nhật trạng thái. Manager/Admin xử lý ngoại lệ.

## Acceptance Criteria / Tiêu chí hoàn thành

- Đơn có thông tin giao rõ.
- Staff cập nhật trạng thái giao đúng quyền.
- Giao lỗi có lý do.
- Customer theo dõi được trạng thái phù hợp.

## Edge Cases / Trường hợp biên

- Khách đổi địa chỉ sau khi xác nhận.
- Người nhận không nghe máy.
- Đơn có sản phẩm cần bảo quản đặc biệt.
- Phí giao thay đổi theo khu vực tương lai.

## Error Cases / Trường hợp lỗi

- Thiếu địa chỉ.
- Số điện thoại không hợp lệ.
- Chuyển trạng thái giao sai.
- Người thao tác không đủ quyền.

## Future Enhancement / Mở rộng tương lai

- Shipping provider integration.
- Delivery tracking.
- Same-day delivery policy.
- Multi-shipment order.

