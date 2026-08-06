# Notifications Feature Specification / Đặc tả tính năng thông báo

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1 |
| Dependency | Authentication, Orders, Customers, Promotions, Notification Gateway |
| Version | Version 1 |
| Owner | Product Owner, Marketing |
| Status | Draft for business specification |

## Overview / Tổng quan

Notifications quản lý thông báo tài khoản, đơn hàng, chăm sóc khách và marketing qua các kênh như email, SMS, Zalo, push hoặc in-app sau này.

## Business Goal / Mục tiêu kinh doanh

Giúp khách nhận thông tin đúng lúc và giúp cửa hàng chăm sóc khách mà không spam.

## Scope / Phạm vi

Trong phạm vi: loại thông báo, ngữ cảnh gửi, ưu tiên, opt-in marketing, trạng thái gửi nghiệp vụ. Ngoài phạm vi: provider integration, API notification, template rendering.

## Requirement / Yêu cầu

- Thông báo tài khoản và đơn hàng được ưu tiên.
- Marketing notification phải tôn trọng lựa chọn nhận tin.
- Nội dung thông báo phải rõ mục đích.
- Lỗi gửi thông báo không làm hỏng luồng mua hàng chính.

## User Story / User story

- Là Customer, tôi muốn nhận thông báo trạng thái đơn.
- Là Staff, tôi muốn biết khách đã được thông báo hay chưa.
- Là Marketing, tôi muốn gửi ưu đãi cho nhóm khách phù hợp.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Send order update | System, Staff | Khách nhận trạng thái đơn. |
| Send account verification | System | Người dùng xác minh tài khoản. |
| Send promotion | Marketing | Khách opt-in nhận ưu đãi. |

## Business Flow / Luồng nghiệp vụ

1. Một sự kiện nghiệp vụ phát sinh.
2. Hệ thống xác định loại thông báo và kênh phù hợp.
3. Kiểm tra quyền/opt-in nếu là marketing.
4. Gửi thông báo ở phase triển khai sau.
5. Ghi nhận trạng thái gửi ở mức nghiệp vụ.

## Validation Rule / Quy tắc validation

- Không gửi marketing nếu khách không đồng ý.
- Thông báo bảo mật không chứa dữ liệu nhạy cảm dư thừa.
- Nội dung cần đúng ngữ cảnh và không gây hiểu nhầm.

## Permission / Phân quyền

System gửi notification tự động. Marketing tạo nội dung marketing. Manager/Admin phê duyệt campaign. Customer quản lý lựa chọn nhận marketing.

## Acceptance Criteria / Tiêu chí hoàn thành

- Notification có loại và ưu tiên rõ.
- Order/account notification được ưu tiên.
- Marketing notification tôn trọng opt-in.
- Lỗi gửi có hướng xử lý.

## Edge Cases / Trường hợp biên

- Khách đổi email/số điện thoại.
- Notification gửi trùng.
- Kênh gửi bị lỗi.

## Error Cases / Trường hợp lỗi

- Không có thông tin liên hệ hợp lệ.
- Khách không opt-in marketing.
- Provider lỗi ở phase sau.

## Future Enhancement / Mở rộng tương lai

- Notification preference center.
- Zalo/push integration.
- AI response suggestion for support.

