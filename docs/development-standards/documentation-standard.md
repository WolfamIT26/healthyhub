# Documentation Standard / Chuẩn tài liệu

## Purpose / Mục tiêu

Documentation Standard đảm bảo mọi thay đổi code sau này đều có tài liệu tương ứng, giúp AI Agent và developer tiếp tục làm việc không mất ngữ cảnh.

## Language Naming / Ngôn ngữ và đặt tên

- Markdown content dùng tiếng Việt.
- Heading dùng song ngữ English + Vietnamese.
- File name dùng tiếng Anh.
- Folder dùng tiếng Anh.
- Prompt dùng tiếng Việt.

## Required Updates / Cập nhật bắt buộc

Sau task module, cập nhật:

- `Status.md`.
- `Report.md`.
- `Checklist.md`.
- `ChangeLog.md`.
- `TODO.md` nếu còn việc mở.
- `Decision.md` nếu có quyết định mới.

Nếu thay đổi:

- Database: cập nhật Database Specification và tài liệu module.
- API: cập nhật API Specification và Data Contract.
- UI: cập nhật UI Contract và component mapping nếu cần.
- Architecture: cập nhật ADR hoặc Decision.
- Security: cập nhật tài liệu bảo mật liên quan.

## Report Rule / Quy tắc báo cáo

Report phải nêu file tạo, file sửa, test đã chạy, phần chưa hoàn thành và rủi ro còn lại. Không báo hoàn thành chung chung.

## Work Summary Rule / Quy tắc tổng hợp sau mỗi lần làm

Sau mỗi prompt lớn, tạo một file tổng hợp trong `docs/work-summaries` theo quy tắc đã có, để chủ dự án dễ kiểm tra lại.

