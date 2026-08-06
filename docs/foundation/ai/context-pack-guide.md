# Context Pack Guide / Hướng dẫn context pack

## Purpose / Mục tiêu

Context Pack là gói ngữ cảnh rút gọn theo module hoặc domain để AI Agent đọc đúng thông tin, tiết kiệm token và giảm nguy cơ dùng tài liệu không liên quan.

## Context Pack Content / Nội dung context pack

Một context pack nên có:

- Module purpose.
- Related folders.
- Related docs.
- Architecture notes.
- Security notes.
- Testing notes.
- Known decisions.
- Files cần cập nhật sau khi làm.

## Token Optimization / Tối ưu token

AI Agent không nên đọc toàn bộ repository nếu chỉ xử lý một module nhỏ. Đọc foundation docs, project rules, folder structure và context pack liên quan trước; chỉ mở thêm file khi cần xác minh.

## Update Rule / Quy tắc cập nhật

Khi module thay đổi đáng kể về scope, architecture, API, database hoặc AI behavior, context pack của module phải được cập nhật để agent sau không dùng thông tin cũ.

## Related / Liên quan

- [.ai context packs](../../../.ai/context-packs/README.md)
- [AI Workflow / Quy trình AI](../development/ai-workflow.md)

