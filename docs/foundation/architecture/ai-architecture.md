# AI Architecture / Kiến trúc AI

## Principle / Nguyên tắc

AI là một layer toàn hệ thống, không chỉ là một module riêng. Điều này nghĩa là nhiều module có thể dùng AI, nhưng mọi request AI phải đi qua rule, prompt, context, gateway và logging thống nhất.

## AI Capability Groups / Nhóm năng lực AI

- Customer AI: chat, recommendation, search, compare và FAQ.
- Nutrition AI: meal planner, calories, BMR/TDEE, macro, healthy score và allergy checker.
- Product AI: summary, ingredient explanation và review summary.
- Vision AI: OCR, QR scanner và food image recognition.
- Business AI: sales analysis, inventory prediction và customer analysis.
- Marketing AI: caption, email và campaign assistant.

## Architecture Rule / Quy tắc kiến trúc

- Prompt phải có mục tiêu, input, output format, constraint và safety rule.
- Context phải được lấy từ nguồn nội bộ như `.ai/context`, `.ai/context-packs` hoặc `knowledge`.
- AI output phải được kiểm chứng theo mức rủi ro trước khi hiển thị hoặc dùng cho quyết định nghiệp vụ.
- Dữ liệu nhạy cảm không được gửi ra provider nếu chưa có policy.

## Extension Rule / Quy tắc mở rộng

Khi thêm AI mới, phải cập nhật prompt, context pack, AI skill nếu cần, tài liệu module và checklist review AI. Nếu thay đổi provider hoặc model policy, phải tạo ADR.

## Related / Liên quan

- [AI Overview / Tổng quan AI](../ai/ai-overview.md)
- [Context Pack Guide / Hướng dẫn context pack](../ai/context-pack-guide.md)

