# Testing Strategy / Chiến lược kiểm thử

## Principle / Nguyên tắc

Test phải phù hợp rủi ro. Luồng authentication, authorization, payment, order, data privacy, AI recommendation và admin action cần coverage cao hơn thay đổi UI nhỏ hoặc tài liệu.

## Test Levels / Cấp kiểm thử

- Unit test: kiểm tra logic nhỏ, nhanh, độc lập.
- Integration test: kiểm tra nhiều thành phần làm việc cùng nhau.
- E2E test: kiểm tra luồng người dùng quan trọng.
- Manual test: xác nhận UX, nội dung, edge case hoặc tích hợp chưa tự động hóa.
- Security test: kiểm tra phân quyền, input độc hại, rate limit và secret exposure.
- Performance test: kiểm tra tải, slow query và response time.

## AI Testing / Kiểm thử AI

AI feature phải kiểm tra prompt, context, output format, safety rule, fallback, logging và human review requirement. Không đánh giá AI chỉ bằng một ví dụ thành công.

## Related / Liên quan

- [AI Workflow / Quy trình AI](../development/ai-workflow.md)
- [Code Review Workflow / Quy trình review code](../development/code-review-workflow.md)

