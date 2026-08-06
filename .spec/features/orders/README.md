# Orders Feature Specification / Đặc tả tính năng đơn hàng

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | MVP |
| Dependency | Cart, Customers, Inventory, Payment, Shipping, Notification |
| Version | MVP |
| Owner | Product Owner, Operations Manager |
| Status | Draft for business specification |

## Overview / Tổng quan

Orders quản lý vòng đời đơn hàng từ lúc khách xác nhận mua đến khi xử lý, giao, hoàn tất hoặc hủy.

## Business Goal / Mục tiêu kinh doanh

Đảm bảo cửa hàng xử lý đơn chính xác, khách theo dõi được trạng thái và dữ liệu bán hàng phục vụ analytics.

## Scope / Phạm vi

Trong phạm vi: tạo đơn từ cart hợp lệ, trạng thái đơn cơ bản, hủy đơn, ghi lý do, lịch sử đơn của khách. Ngoài phạm vi: schema order, API order, UI order management.

## Requirement / Yêu cầu

- Đơn hàng phải có thông tin khách, sản phẩm, nhận hàng và trạng thái.
- Cart phải hợp lệ trước khi tạo đơn.
- Staff/Manager xử lý trạng thái đơn theo quyền.
- Hủy đơn phải có lý do.
- Customer xem đơn của chính mình.

## User Story / User story

- Là Customer, tôi muốn đặt hàng và theo dõi trạng thái.
- Là Staff, tôi muốn xem đơn mới để xử lý.
- Là Manager, tôi muốn quản lý đơn để đảm bảo vận hành.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Place order | Customer | Đơn hàng được tạo từ cart hợp lệ. |
| View own order | Customer | Khách xem trạng thái đơn. |
| Process order | Staff | Đơn chuyển trạng thái phù hợp. |
| Cancel order | Customer, Staff, Manager | Đơn bị hủy theo rule. |

## Business Flow / Luồng nghiệp vụ

1. Customer xác nhận cart và thông tin nhận hàng.
2. Hệ thống kiểm tra khả năng bán, giá, coupon và thông tin nhận hàng.
3. Đơn hàng được tạo ở trạng thái ban đầu.
4. Staff xử lý đơn và cập nhật trạng thái.
5. Đơn hoàn tất, hủy hoặc cần chăm sóc tiếp theo.

## Validation Rule / Quy tắc validation

- Đơn không tạo nếu cart không hợp lệ.
- Đơn phải có thông tin nhận hàng đủ.
- Trạng thái đơn chỉ chuyển theo luồng hợp lệ.
- Hủy đơn cần lý do.

## Permission / Phân quyền

Customer tạo và xem đơn của chính mình. Staff xử lý đơn. Manager/Admin quản lý và can thiệp theo policy. Guest đặt hàng giới hạn nếu cửa hàng cho phép.

## Acceptance Criteria / Tiêu chí hoàn thành

- Đơn có vòng đời rõ.
- Customer theo dõi được đơn của mình.
- Staff xử lý đơn đúng quyền.
- Hủy đơn ghi lý do.
- Order data sẵn sàng cho payment, shipping và analytics sau này.

## Edge Cases / Trường hợp biên

- Sản phẩm hết hàng khi đặt.
- Khách đổi thông tin nhận hàng sau khi đặt.
- Đơn thanh toán lỗi.
- Đơn giao không thành công.

## Error Cases / Trường hợp lỗi

- Cart không hợp lệ.
- Thiếu thông tin nhận hàng.
- Chuyển trạng thái sai luồng.
- Người thao tác không đủ quyền.

## Future Enhancement / Mở rộng tương lai

- Return/refund flow.
- Split shipment.
- Staff-assisted order.
- Order SLA dashboard.

