# Folder Architecture / Kiến trúc thư mục

## Purpose / Mục tiêu

Cấu trúc thư mục của HealthyHub tách rõ source code, tài liệu, AI system, cấu hình, bảo mật, kiểm thử, triển khai, monitoring, logging, backup, storage, planning, design, legal, research và release.

## Top-level Meaning / Ý nghĩa thư mục cấp root

| Folder / Thư mục | Meaning / Ý nghĩa |
| --- | --- |
| `.ai` | Hệ thống rule, skill, prompt, context và memory cho AI Agent. |
| `.spec` | Đặc tả tính năng, nguồn chính để AI sinh tài liệu chi tiết hoặc code sau này. |
| `apps` | Ứng dụng web, api và mobile tương lai. |
| `docs` | Tài liệu kỹ thuật và tài liệu nền tảng. |
| `modules` | Quản lý nghiệp vụ độc lập với source code. |
| `database` | Schema, migration, seed và ERD. |
| `config` | Cấu hình môi trường, Docker, security và workspace. |
| `deployment` | Tài liệu và cấu trúc triển khai. |
| `security` | Checklist, policy và report bảo mật. |
| `tests` | E2E, integration và performance test ở cấp hệ thống. |
| `templates` | Template email, notification và tài liệu dùng lại. |

## Navigation Rule / Quy tắc tìm file

- Cần hiểu dự án: đọc `README.md`, `docs/README.md`, `docs/foundation/README.md`.
- Cần hiểu cấu trúc: đọc `CAU_TRUC_THU_MUC.md` và `docs/01-folder-structure.md`.
- Cần tạo feature: đọc `.spec/README.md` và module liên quan.
- Cần làm với AI: đọc `.ai/README.md` và `docs/foundation/ai/README.md`.

## Related / Liên quan

- [Folder Structure / Cấu trúc thư mục](../../01-folder-structure.md)
- [Module Workflow / Quy trình module](../development/module-workflow.md)

