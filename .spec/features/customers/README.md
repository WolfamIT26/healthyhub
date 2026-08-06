# Customers Feature Specification / Đặc tả tính năng khách hàng

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1 |
| Dependency | Authentication, Orders, Loyalty, Notification |
| Version | Version 1 |
| Owner | Product Owner, Customer Success |
| Status | Draft for business specification |

## Overview / Tổng quan

Customers quản lý hồ sơ khách hàng, lịch sử mua, phân nhóm và thông tin chăm sóc khách.

## Business Goal / Mục tiêu kinh doanh

Tăng khả năng giữ chân khách, hỗ trợ chăm sóc cá nhân hóa và tạo dữ liệu nền cho loyalty, AI recommendation và analytics.

## Scope / Phạm vi

Trong phạm vi: hồ sơ khách hàng, địa chỉ, lịch sử đơn, phân nhóm cơ bản, ghi chú chăm sóc. Ngoài phạm vi: database profile schema, API customer, CRM nâng cao.

## Requirement / Yêu cầu

- Customer xem và cập nhật thông tin cá nhân cơ bản.
- Customer xem lịch sử đơn của chính mình.
- Staff xem thông tin cần thiết để hỗ trợ đơn hàng.
- Manager phân nhóm khách theo tiêu chí vận hành.
- Dữ liệu khách phải tuân thủ privacy guideline.

## User Story / User story

- Là Customer, tôi muốn lưu thông tin nhận hàng để đặt đơn nhanh hơn.
- Là Staff, tôi muốn xem thông tin liên hệ để hỗ trợ giao hàng.
- Là Manager, tôi muốn phân nhóm khách để chăm sóc tốt hơn.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| View own profile | Customer | Khách xem thông tin cá nhân. |
| Update contact info | Customer | Thông tin được cập nhật hợp lệ. |
| View customer support context | Staff | Staff hỗ trợ đúng đơn và khách. |
| Segment customers | Manager | Nhóm khách phục vụ marketing/loyalty. |

## Business Flow / Luồng nghiệp vụ

1. Customer đăng nhập.
2. Customer xem hoặc cập nhật hồ sơ.
3. Hệ thống kiểm tra quyền và tính hợp lệ.
4. Staff/Manager chỉ truy cập dữ liệu theo vai trò.
5. Dữ liệu được dùng cho chăm sóc, loyalty hoặc AI theo chính sách.

## Validation Rule / Quy tắc validation

- Số điện thoại và email phải hợp lệ theo chính sách.
- Địa chỉ nhận hàng phải đủ thông tin cần thiết.
- Staff không được xem dữ liệu ngoài phạm vi hỗ trợ.
- Dữ liệu nhạy cảm không được đưa vào AI nếu chưa có policy.

## Permission / Phân quyền

Customer quản lý hồ sơ của chính mình. Staff xem giới hạn. Manager xem báo cáo/phân nhóm. Admin cấu hình policy. Super Admin chỉ dùng cho SaaS.

## Acceptance Criteria / Tiêu chí hoàn thành

- Customer có hồ sơ và lịch sử đơn của chính mình.
- Staff có đủ thông tin để hỗ trợ nhưng không quá quyền.
- Phân nhóm khách có rule rõ.
- Privacy impact được ghi nhận.
- Dữ liệu khách sẵn sàng dùng cho loyalty/AI khi có consent/policy.

## Edge Cases / Trường hợp biên

- Customer có nhiều địa chỉ.
- Customer đổi số điện thoại khi có đơn đang giao.
- Trùng email hoặc số điện thoại.
- Khách yêu cầu ngừng nhận marketing.

## Error Cases / Trường hợp lỗi

- Thông tin liên hệ không hợp lệ.
- Người dùng xem hồ sơ không thuộc quyền.
- Dữ liệu khách thiếu khi staff xử lý đơn.

## Future Enhancement / Mở rộng tương lai

- Customer 360 profile.
- Consent management.
- Customer lifetime value.
- AI customer segmentation.

