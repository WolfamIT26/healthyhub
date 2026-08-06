# Secret Management Guideline / Hướng dẫn quản lý secret

## Secret Definition / Định nghĩa secret

Secret bao gồm password, API key, private key, JWT secret, database credential, payment key, storage key, AI provider key và webhook signing secret.

## Storage Rule / Quy tắc lưu trữ

- Không commit secret vào Git.
- Không ghi secret vào log, report, screenshot hoặc prompt AI.
- Secret production phải nằm trong secret manager hoặc cơ chế bảo mật của nền tảng triển khai.
- Secret local chỉ nằm trong `.env` không được commit.

## Rotation Rule / Quy tắc xoay vòng

Secret phải được đổi khi có nghi ngờ lộ, khi nhân sự rời dự án hoặc theo chu kỳ vận hành. Rotation phải có checklist để tránh downtime.

## AI Rule / Quy tắc với AI

Không gửi secret vào prompt, context pack hoặc file knowledge. Nếu cần debug cấu hình, chỉ dùng tên biến và dấu hiệu lỗi đã được ẩn giá trị nhạy cảm.

## Related / Liên quan

- [Security Guideline / Hướng dẫn bảo mật](security-guideline.md)
- [AI Documentation Guide / Hướng dẫn tài liệu AI](../ai/ai-documentation-guide.md)

