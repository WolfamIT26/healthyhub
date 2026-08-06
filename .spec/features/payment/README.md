# Payment Feature Specification / Đặc tả tính năng thanh toán

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1 |
| Dependency | Orders, Security, Payment Gateway |
| Version | Version 1 |
| Owner | Product Owner, Operations Manager |
| Status | Draft for business specification |

## Overview / Tổng quan

Payment quản lý phương thức và trạng thái thanh toán ở mức nghiệp vụ, chuẩn bị cho tích hợp Payment Gateway sau này.

## Business Goal / Mục tiêu kinh doanh

Giúp cửa hàng xác nhận tình trạng thanh toán rõ ràng, giảm nhầm lẫn khi xử lý đơn và chuẩn bị mở rộng thanh toán online.

## Scope / Phạm vi

Trong phạm vi: phương thức thanh toán, trạng thái thanh toán, xác nhận thủ công/online ở mức nghiệp vụ, ghi chú lỗi. Ngoài phạm vi: API payment, provider integration, database transaction.

## Requirement / Yêu cầu

- Mỗi đơn cần có trạng thái thanh toán rõ.
- Staff/Manager thấy được tình trạng thanh toán khi xử lý đơn.
- Thanh toán online tương lai phải được xác nhận qua Payment Gateway.
- Hoàn tiền hoặc điều chỉnh thanh toán cần quyền cao và audit.

## User Story / User story

- Là Customer, tôi muốn biết đơn của tôi đã thanh toán hay chưa.
- Là Staff, tôi muốn biết đơn có đủ điều kiện xử lý theo thanh toán.
- Là Manager, tôi muốn kiểm soát thanh toán lỗi hoặc hoàn tiền.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Select payment method | Customer | Đơn có phương thức thanh toán. |
| Confirm payment status | Staff, Manager | Trạng thái thanh toán rõ. |
| Handle payment failure | Staff, Customer | Có hướng xử lý tiếp. |
| Request refund | Manager, Admin | Hoàn tiền được xử lý theo policy. |

## Business Flow / Luồng nghiệp vụ

1. Customer chọn phương thức thanh toán.
2. Hệ thống ghi nhận trạng thái ban đầu.
3. Staff/Manager kiểm tra điều kiện thanh toán khi xử lý đơn.
4. Nếu thanh toán online lỗi, khách hoặc staff nhận hướng dẫn.
5. Hoàn tiền/điều chỉnh cần quyền phù hợp.

## Validation Rule / Quy tắc validation

- Đơn không được đánh dấu đã thanh toán nếu chưa đủ điều kiện.
- Refund phải có lý do.
- Payment status chỉ chuyển theo luồng hợp lệ.
- Không lưu hoặc hiển thị dữ liệu thanh toán nhạy cảm trong tài liệu nghiệp vụ.

## Permission / Phân quyền

Customer chọn phương thức và xem trạng thái. Staff xem và cập nhật giới hạn. Manager/Admin xác nhận ngoại lệ hoặc refund. Super Admin không xử lý thanh toán cửa hàng trừ SaaS policy.

## Acceptance Criteria / Tiêu chí hoàn thành

- Trạng thái thanh toán rõ trong vòng đời đơn.
- Staff không xử lý nhầm đơn chưa đủ điều kiện thanh toán.
- Payment failure có hướng xử lý.
- Refund/adjustment có quyền và lý do.

## Edge Cases / Trường hợp biên

- Khách thanh toán trễ.
- Thanh toán online báo pending lâu.
- Đơn bị hủy sau khi đã thanh toán.
- Thanh toán một phần ở tương lai.

## Error Cases / Trường hợp lỗi

- Payment status không hợp lệ.
- Provider online lỗi ở phase sau.
- Người thao tác không đủ quyền.

## Future Enhancement / Mở rộng tương lai

- Payment provider integration.
- Refund automation.
- Payment reconciliation.
- Fraud risk flag.

