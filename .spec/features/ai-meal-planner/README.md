# AI Meal Planner Feature Specification / Đặc tả tính năng AI Meal Planner

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Future |
| Dependency | Products, Nutrition Knowledge, AI Gateway, Customers |
| Version | Future |
| Owner | Product Owner, AI Engineer |
| Status | Draft for business specification |

## Overview / Tổng quan

AI Meal Planner gợi ý kế hoạch ăn uống healthy ở mức tham khảo, có thể liên kết với sản phẩm HealthyHub phù hợp.

## Business Goal / Mục tiêu kinh doanh

Tăng giá trị tư vấn và tạo cơ hội bán sản phẩm theo ngữ cảnh healthy lifestyle.

## Scope / Phạm vi

Trong phạm vi: meal suggestion tham khảo, sản phẩm liên quan, disclaimer. Ngoài phạm vi: tư vấn y tế cá nhân, diet plan điều trị, tính toán y khoa, implementation.

## Requirement / Yêu cầu

- Meal plan phải có disclaimer không thay thế chuyên gia.
- Không đưa lời khuyên cho bệnh lý cá nhân.
- Gợi ý sản phẩm chỉ dùng sản phẩm đang bán.
- Cần hỏi thông tin thiếu ở mức an toàn hoặc fallback.

## User Story / User story

- Là Customer, tôi muốn gợi ý bữa ăn healthy đơn giản.
- Là Member, tôi muốn biết sản phẩm nào phù hợp với kế hoạch ăn uống tham khảo.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Generate meal suggestion | Customer | Nhận gợi ý tham khảo. |
| Link product suggestion | Customer | Thấy sản phẩm liên quan. |
| Safety fallback | AI | Từ chối tư vấn y tế rủi ro. |

## Business Flow / Luồng nghiệp vụ

1. Customer nhập mục tiêu hoặc nhu cầu chung.
2. AI kiểm tra phạm vi an toàn.
3. AI tạo meal suggestion tham khảo.
4. AI gợi ý sản phẩm liên quan nếu hợp lệ.
5. Hệ thống hiển thị disclaimer.

## Validation Rule / Quy tắc validation

- Không nhận xử lý bệnh lý cụ thể.
- Không dùng dữ liệu sức khỏe nhạy cảm nếu chưa có policy.
- Sản phẩm gợi ý phải public và phù hợp cảnh báo.
- Output phải nêu tính tham khảo.

## Permission / Phân quyền

Customer/Member dùng feature khi bật. Manager/Admin cấu hình disclaimer và knowledge. AI không lưu dữ liệu sức khỏe nếu chưa có policy.

## Acceptance Criteria / Tiêu chí hoàn thành

- Meal suggestion có disclaimer.
- Không có tư vấn y tế điều trị.
- Sản phẩm gợi ý hợp lệ.
- Có fallback với yêu cầu rủi ro.

## Edge Cases / Trường hợp biên

- Người dùng khai dị ứng.
- Người dùng có bệnh lý.
- Thiếu dữ liệu calories/thành phần.

## Error Cases / Trường hợp lỗi

- Prompt yêu cầu y tế ngoài phạm vi.
- AI thiếu knowledge.
- Sản phẩm liên quan hết hàng.

## Future Enhancement / Mở rộng tương lai

- Nutrition profile có consent.
- Weekly planner.
- Integration với calories calculator.

