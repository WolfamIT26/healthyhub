# AI Chat Feature Specification / Đặc tả tính năng AI Chat

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1.5 |
| Dependency | Products, Knowledge, Customers, AI Gateway, Notification |
| Version | Version 1.5 |
| Owner | Product Owner, AI Engineer |
| Status | Draft for business specification |

## Overview / Tổng quan

AI Chat hỗ trợ khách hỏi về sản phẩm, chính sách cửa hàng và thông tin mua hàng trong phạm vi dữ liệu đã được duyệt.

## Business Goal / Mục tiêu kinh doanh

Giảm tải chăm sóc khách hàng, tăng khả năng tư vấn sản phẩm và cải thiện trải nghiệm mua hàng.

## Scope / Phạm vi

Trong phạm vi: trả lời câu hỏi sản phẩm, FAQ, chính sách cơ bản, hướng dẫn mua hàng. Ngoài phạm vi: chẩn đoán y tế, quyết định thay staff, truy cập dữ liệu nhạy cảm, AI runtime.

## Requirement / Yêu cầu

- AI chỉ trả lời dựa trên context/knowledge được duyệt.
- AI phải fallback khi thiếu dữ liệu.
- AI không được đưa lời khuyên y tế thay chuyên gia.
- Câu trả lời nhạy cảm cần chuyển sang staff.

## User Story / User story

- Là Guest, tôi muốn hỏi nhanh về sản phẩm trước khi mua.
- Là Customer, tôi muốn hỏi về chính sách đơn hàng cơ bản.
- Là Staff, tôi muốn AI hỗ trợ giảm câu hỏi lặp lại.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Ask product question | Guest, Customer | Nhận câu trả lời dựa trên dữ liệu sản phẩm. |
| Ask policy question | Guest, Customer | Nhận thông tin chính sách cơ bản. |
| Escalate to staff | AI, Customer | Câu hỏi rủi ro được chuyển người thật. |

## Business Flow / Luồng nghiệp vụ

1. Người dùng gửi câu hỏi.
2. AI xác định phạm vi câu hỏi.
3. AI lấy context từ knowledge/product/policy được duyệt.
4. AI trả lời hoặc fallback nếu thiếu dữ liệu.
5. Trường hợp nhạy cảm được chuyển cho staff.

## Validation Rule / Quy tắc validation

- Câu trả lời không chứa secret hoặc dữ liệu cá nhân không được phép.
- Câu trả lời dinh dưỡng phải có giới hạn trách nhiệm.
- AI không bịa thông tin sản phẩm.
- AI không xử lý payment/order action thay người dùng.

## Permission / Phân quyền

Guest/Customer dùng AI Chat public. Staff xem hoặc tiếp quản hội thoại theo policy. Admin cấu hình phạm vi knowledge. AI không có quyền tự thay đổi dữ liệu.

## Acceptance Criteria / Tiêu chí hoàn thành

- AI trả lời được câu hỏi trong phạm vi knowledge.
- AI fallback khi thiếu dữ liệu.
- Câu hỏi nhạy cảm được chuyển staff.
- Có rule an toàn cho dinh dưỡng và dữ liệu khách.

## Edge Cases / Trường hợp biên

- Người dùng hỏi ngoài phạm vi healthy/shop.
- Người dùng yêu cầu tư vấn bệnh lý.
- Knowledge sản phẩm chưa cập nhật.
- Người dùng nhập prompt injection.

## Error Cases / Trường hợp lỗi

- AI không đủ context.
- AI Gateway lỗi ở phase triển khai sau.
- Câu hỏi chứa dữ liệu nhạy cảm.

## Future Enhancement / Mở rộng tương lai

- Chat personalization theo consent.
- Human handoff dashboard.
- Conversation summary cho staff.

