# Project Rules / Quy tắc dự án

## Principle / Nguyên tắc

HealthyHub là dự án Full Stack có AI layer toàn hệ thống. Mọi thiết kế phải giữ được tính rõ ràng, mở rộng được và có tài liệu đi kèm.

## Mandatory AI Workflow / Quy trình bắt buộc cho AI Agent

Trước khi làm:

1. Đọc tài liệu này.
2. Đọc [Folder Structure / Cấu trúc thư mục](01-folder-structure.md).
3. Đọc [.ai/context](../.ai/context/README.md).
4. Đọc tài liệu module liên quan trong `docs/modules`.

Sau khi làm:

- Cập nhật `Status.md`.
- Cập nhật `Report.md`.
- Cập nhật `Checklist.md`.
- Cập nhật `ChangeLog.md`.
- Tạo một file tổng hợp mới trong `docs/work-summaries`.
- Nếu thay đổi database, cập nhật `Database.md`.
- Nếu thay đổi API, cập nhật `API.md`.
- Nếu thay đổi architecture, cập nhật `Architecture.md` hoặc tài liệu tương ứng.

## Technology Rule / Quy tắc công nghệ

- Frontend dùng React, Vite, TypeScript, Tailwind CSS.
- Backend dùng Node.js, NestJS và TypeScript.
- Database dùng MySQL và SQL.
- Tooling dùng Docker, Git, GitHub và phpMyAdmin.
- Không thêm framework mới nếu chưa có quyết định trong `Decision.md`.

## Naming Rule / Quy tắc đặt tên

- Folder dùng tiếng Anh.
- File name dùng tiếng Anh và có numbering khi thuộc tài liệu nền tảng.
- Markdown content dùng tiếng Việt.
- Heading dùng song ngữ English + Vietnamese.
- Code naming dùng tiếng Anh.
- Comment trong code dùng tiếng Việt khi cần comment.
- Database naming dùng tiếng Anh.
- API naming dùng tiếng Anh.
- Prompt dùng tiếng Việt.
- Giao diện người dùng dùng tiếng Việt.

## No Business Code Rule / Quy tắc không viết code nghiệp vụ

Giai đoạn khởi tạo chỉ tạo cấu trúc, tài liệu, rule, template và workflow. Không triển khai nghiệp vụ bán hàng, thanh toán, AI, đơn hàng hoặc quản trị.
