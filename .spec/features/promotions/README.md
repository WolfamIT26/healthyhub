# Promotions Feature Specification / Đặc tả tính năng khuyến mãi

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1 |
| Dependency | Products, Coupons, Customers, Analytics |
| Version | Version 1 |
| Owner | Marketing, Manager |
| Status | Draft for business specification |

## Overview / Tổng quan

Promotions quản lý chương trình ưu đãi theo thời gian, sản phẩm, nhóm khách hoặc chiến dịch.

## Business Goal / Mục tiêu kinh doanh

Tăng doanh số, đẩy sản phẩm trọng tâm và hỗ trợ marketing campaign có kiểm soát.

## Scope / Phạm vi

Trong phạm vi: promotion campaign, thời gian hiệu lực, điều kiện áp dụng, rule ưu tiên/cộng dồn, trạng thái chiến dịch. Ngoài phạm vi: API promotion, database promotion, UI campaign builder.

## Requirement / Yêu cầu

- Promotion phải có thời gian hiệu lực.
- Promotion có điều kiện áp dụng rõ.
- Promotion đang chạy cần hạn chế chỉnh sửa gây sai báo cáo.
- Cần rule xử lý khi nhiều promotion cùng áp dụng.

## User Story / User story

- Là Marketing, tôi muốn tạo campaign giảm giá theo dịp.
- Là Customer, tôi muốn thấy ưu đãi hợp lệ khi mua.
- Là Manager, tôi muốn kiểm soát hiệu quả chương trình.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Create promotion | Manager, Marketing | Chiến dịch được cấu hình nghiệp vụ. |
| Apply promotion | Customer | Ưu đãi được áp dụng nếu đủ điều kiện. |
| End promotion | Manager | Chiến dịch không còn hiệu lực. |

## Business Flow / Luồng nghiệp vụ

1. Marketing đề xuất promotion.
2. Manager xác nhận điều kiện và thời gian.
3. Promotion được bật theo lịch.
4. Customer mua sản phẩm đủ điều kiện.
5. Hệ thống áp dụng ưu đãi theo rule.
6. Analytics ghi nhận hiệu quả ở phase sau.

## Validation Rule / Quy tắc validation

- Thời gian bắt đầu phải trước thời gian kết thúc.
- Điều kiện áp dụng không được mâu thuẫn.
- Promotion không được làm sai chính sách giá tối thiểu.
- Rule ưu tiên với coupon phải rõ.

## Permission / Phân quyền

Marketing đề xuất/soạn nội dung. Manager/Admin phê duyệt và bật promotion. Customer chỉ nhận ưu đãi hợp lệ.

## Acceptance Criteria / Tiêu chí hoàn thành

- Promotion có điều kiện và thời gian rõ.
- Nhiều promotion có rule xử lý.
- Customer chỉ nhận ưu đãi hợp lệ.
- Promotion có trạng thái quản lý.

## Edge Cases / Trường hợp biên

- Promotion trùng thời gian.
- Promotion áp dụng cho sản phẩm hết hàng.
- Promotion bị tắt giữa chiến dịch.
- Khách dùng coupon cùng promotion.

## Error Cases / Trường hợp lỗi

- Điều kiện promotion không hợp lệ.
- Promotion hết hạn.
- Người tạo không đủ quyền.

## Future Enhancement / Mở rộng tương lai

- Campaign approval workflow.
- AI campaign assistant.
- Promotion performance dashboard.

