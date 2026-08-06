# Prompt Library Guide / Hướng dẫn thư viện prompt

## Purpose / Mục tiêu

Prompt Library chuẩn hóa cách ra lệnh cho AI Agent. Prompt tốt giúp giảm sai lệch, tránh tạo file trùng, tránh vượt phạm vi và buộc agent cập nhật tài liệu sau khi làm.

## Prompt Structure / Cấu trúc prompt

Prompt nên có:

- Vai trò AI Agent.
- Mục tiêu cụ thể.
- File hoặc thư mục bắt buộc đọc.
- Phạm vi được phép.
- Phạm vi không được làm.
- Output yêu cầu.
- Checklist sau khi hoàn thành.

## Prompt Quality Rule / Quy tắc chất lượng prompt

- Viết bằng tiếng Việt.
- Nêu rõ không viết code nếu chỉ cần tài liệu.
- Nêu rõ không thay đổi stack nếu chưa có ADR.
- Nêu rõ file cần cập nhật sau khi làm.
- Với task review, ghi rõ không sửa file nếu chỉ audit.

## Related / Liên quan

- [.ai prompts](../../../.ai/prompts/README.md)
- [AI Documentation Guide / Hướng dẫn tài liệu AI](ai-documentation-guide.md)

