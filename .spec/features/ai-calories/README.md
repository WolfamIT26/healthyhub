# AI Calories Feature Specification / Đặc tả tính năng AI Calories

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 2 |
| Dependency | Products, Nutrition Knowledge, AI Gateway |
| Version | Version 2 |
| Owner | Product Owner, AI Engineer |
| Status | Draft for business specification |

## Overview / Tổng quan

AI Calories ước lượng calories từ thông tin sản phẩm hoặc input người dùng ở mức tham khảo.

## Business Goal / Mục tiêu kinh doanh

Giúp khách hiểu giá trị năng lượng tương đối của sản phẩm healthy và hỗ trợ lựa chọn có ý thức hơn.

## Scope / Phạm vi

Trong phạm vi: ước lượng calories, giải thích nguồn dữ liệu, disclaimer. Ngoài phạm vi: tính toán y khoa chính xác, diet therapy, database nutrition schema.

## Requirement / Yêu cầu

- Kết quả calories phải ghi rõ là ước lượng nếu không có dữ liệu chuẩn.
- Nếu sản phẩm có thông tin dinh dưỡng, AI phải ưu tiên dữ liệu đó.
- Không dùng để chẩn đoán hoặc chỉ định chế độ điều trị.
- Thiếu dữ liệu phải fallback.

## User Story / User story

- Là Customer, tôi muốn biết calories ước lượng của sản phẩm.
- Là Member, tôi muốn so sánh calories giữa sản phẩm.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Estimate product calories | Customer | Nhận calories tham khảo. |
| Compare calories | Customer | Hiểu sản phẩm nào ít/nhiều năng lượng hơn. |
| Missing nutrition fallback | AI | Thông báo thiếu dữ liệu. |

## Business Flow / Luồng nghiệp vụ

1. Customer chọn sản phẩm hoặc nhập thông tin.
2. AI kiểm tra dữ liệu dinh dưỡng có sẵn.
3. AI đưa ước lượng hoặc giải thích thiếu dữ liệu.
4. Hệ thống hiển thị disclaimer.

## Validation Rule / Quy tắc validation

- Kết quả phải ghi rõ nguồn hoặc mức ước lượng.
- Không khẳng định chính xác tuyệt đối.
- Không đưa lời khuyên y tế cá nhân.
- Không dùng dữ liệu sức khỏe nhạy cảm nếu chưa có policy.

## Permission / Phân quyền

Guest/Customer có thể xem calories public. Manager/Admin quản lý nguồn nutrition knowledge. AI chỉ đọc dữ liệu được phép.

## Acceptance Criteria / Tiêu chí hoàn thành

- Calories hiển thị ở mức tham khảo.
- Có disclaimer.
- Có fallback khi thiếu dữ liệu.
- Không vượt phạm vi y tế.

## Edge Cases / Trường hợp biên

- Sản phẩm thiếu nutrition facts.
- Serving size không rõ.
- Người dùng nhập thông tin mơ hồ.

## Error Cases / Trường hợp lỗi

- Dữ liệu không đủ.
- AI output quá chắc chắn.
- Sản phẩm không tồn tại.

## Future Enhancement / Mở rộng tương lai

- Macro suggestion.
- BMR/TDEE calculator.
- Serving size normalization.

