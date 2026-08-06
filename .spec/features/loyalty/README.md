# Loyalty Feature Specification / Đặc tả tính năng thành viên và điểm thưởng

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1.5 |
| Dependency | Customers, Orders, Coupons, Promotions |
| Version | Version 1.5 |
| Owner | Product Owner, Marketing |
| Status | Draft for business specification |

## Overview / Tổng quan

Loyalty quản lý điểm thưởng, cấp bậc thành viên và ưu đãi dành cho Member/VIP Customer.

## Business Goal / Mục tiêu kinh doanh

Tăng tỷ lệ quay lại mua hàng và chăm sóc khách hàng giá trị cao.

## Scope / Phạm vi

Trong phạm vi: điểm thưởng, cấp bậc, VIP criteria, ưu đãi thành viên, điều chỉnh điểm khi hủy/hoàn. Ngoài phạm vi: database loyalty, API loyalty, kế toán điểm nâng cao.

## Requirement / Yêu cầu

- Điểm chỉ phát sinh từ hành vi hợp lệ.
- Cấp bậc thành viên có tiêu chí rõ.
- Hủy/hoàn đơn phải điều chỉnh điểm theo policy.
- VIP Customer cần tiêu chí có thể audit.

## User Story / User story

- Là Member, tôi muốn nhận điểm sau khi mua hàng.
- Là VIP Customer, tôi muốn nhận ưu đãi riêng.
- Là Manager, tôi muốn kiểm soát rule điểm và cấp bậc.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Earn points | Customer | Điểm phát sinh từ đơn hợp lệ. |
| Redeem benefit | Member, VIP | Khách nhận ưu đãi hợp lệ. |
| Adjust points | Manager | Điểm được điều chỉnh có lý do. |

## Business Flow / Luồng nghiệp vụ

1. Customer hoàn tất hành vi mua hợp lệ.
2. Hệ thống xác định điểm/cấp bậc theo rule.
3. Customer nhận quyền lợi thành viên.
4. Nếu đơn bị hủy/hoàn, điểm được điều chỉnh.
5. Manager theo dõi hiệu quả loyalty.

## Validation Rule / Quy tắc validation

- Điểm không phát sinh từ đơn không hợp lệ.
- Điểm không được âm nếu policy không cho phép.
- Điều chỉnh thủ công cần lý do.
- VIP criteria phải rõ và không tùy tiện.

## Permission / Phân quyền

Member/VIP xem điểm và quyền lợi. Manager/Admin cấu hình loyalty. Staff chỉ xem khi hỗ trợ khách.

## Acceptance Criteria / Tiêu chí hoàn thành

- Điểm và cấp bậc có rule rõ.
- Hủy/hoàn đơn có điều chỉnh điểm.
- VIP Customer có tiêu chí audit được.
- Loyalty không vi phạm privacy hoặc marketing consent.

## Edge Cases / Trường hợp biên

- Khách đạt hạng VIP rồi hủy đơn lớn.
- Điểm hết hạn.
- Nhiều ưu đãi loyalty trùng promotion.

## Error Cases / Trường hợp lỗi

- Rule điểm không hợp lệ.
- Điều chỉnh điểm không có quyền.
- Khách không đủ điều kiện nhận benefit.

## Future Enhancement / Mở rộng tương lai

- Membership subscription.
- Tier automation.
- AI loyalty prediction.

