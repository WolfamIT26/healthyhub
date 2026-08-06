# AI System / Hệ thống AI Development

Thư mục `.ai` là bộ điều phối cho AI Agent làm việc trong dự án.

## Folders / Thư mục

- `agents`: định nghĩa AI Agent theo vai trò.
- `checklists`: checklist vận hành cho từng workflow AI.
- `context`: ngữ cảnh dự án, domain, stack, architecture và AI map.
- `context-packs`: gói ngữ cảnh theo module và core workflow để tối ưu token.
- `rules`: quy tắc bắt buộc khi AI Agent làm việc.
- `skills`: kỹ năng theo vai trò phát triển.
- `prompts`: prompt template dùng cho từng loại nhiệm vụ.
- `templates`: template module, workflow, checklist và report.
- `memory`: lịch sử quyết định, bài học và ghi nhớ AI.
- `personas`: persona cho từng vai trò AI Agent.
- `examples`: ví dụ tốt, ví dụ xấu và best practices.
- `knowledge`: tri thức framework dành cho AI Agent.
- `registry`: sổ đăng ký skills, prompts, templates, context packs, agents và rules.
- `reviewers`: reviewer profile cho architecture, security, documentation, prompt và AI.
- `validators`: tiêu chí kiểm tra folder, markdown, naming, prompt, documentation và rule.
- `workflows`: workflow chuẩn cho generate, review, refactor, audit, testing, documentation và release.

## Mandatory Rule / Quy tắc bắt buộc

AI Agent phải đọc `rules/00-agent-mandatory-rules.md` trước khi sửa hoặc tạo nội dung trong dự án.

## AI Core Status / Trạng thái AI Core

- Status: [Status.md](Status.md)
- Report: [Report.md](Report.md)
- Checklist: [Checklist.md](Checklist.md)
- ChangeLog: [ChangeLog.md](ChangeLog.md)
- Registry: [registry/README.md](registry/README.md)
