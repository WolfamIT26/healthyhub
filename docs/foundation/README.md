# Foundation Documentation / Tài liệu nền tảng

## Purpose / Mục tiêu

Thư mục `docs/foundation` là bộ tài liệu chuẩn để developer và AI Agent dùng chung trước khi tạo tài liệu chi tiết, đặc tả tính năng hoặc code. Bộ tài liệu này khóa các nguyên tắc nền cho HealthyHub nhưng vẫn đủ tổng quát để tái sử dụng cho dự án Full Stack AI khác.

## Reading Order / Thứ tự đọc

1. [Project Overview / Tổng quan dự án](project/project-overview.md)
2. [Architecture Overview / Tổng quan kiến trúc](architecture/architecture-overview.md)
3. [Naming Convention / Quy ước đặt tên](standards/naming-convention.md)
4. [Development Workflow / Quy trình phát triển](development/development-workflow.md)
5. [Security Guideline / Hướng dẫn bảo mật](security/security-guideline.md)
6. [AI Overview / Tổng quan AI](ai/ai-overview.md)
7. [ADR Guide / Hướng dẫn ADR](decision-record/adr-guide.md)

## Documentation Groups / Nhóm tài liệu

| Group / Nhóm | Purpose / Vai trò |
| --- | --- |
| [Project](project/README.md) | Định hướng, phạm vi, lộ trình và thuật ngữ chung. |
| [Architecture](architecture/README.md) | Kiến trúc tổng quan, layer, gateway, AI và folder. |
| [Standards](standards/README.md) | Quy chuẩn đặt tên, Git, commit, version và release. |
| [Development](development/README.md) | Quy trình làm việc cho developer, reviewer và AI Agent. |
| [Security](security/README.md) | Nguyên tắc bảo mật, xác thực, phân quyền, môi trường và secret. |
| [Performance](performance/README.md) | Hiệu năng, cache, tối ưu frontend/backend/database. |
| [Testing](testing/README.md) | Chiến lược test, unit, integration và manual test. |
| [Deployment](deployment/README.md) | Docker, environment, backup, monitoring và release vận hành. |
| [AI](ai/README.md) | AI layer, gateway, skill, prompt, context pack và tài liệu AI. |
| [Decision Record](decision-record/README.md) | Cách ghi nhận quyết định kiến trúc bằng ADR. |

## Operating Rule / Quy tắc sử dụng

- Tài liệu foundation chỉ quy định chuẩn nền, không thay thế đặc tả tính năng trong `.spec/features`.
- Khi tài liệu module hoặc feature mâu thuẫn với foundation, phải tạo ADR hoặc cập nhật foundation trước khi triển khai.
- AI Agent phải đọc tài liệu liên quan trong thư mục này trước khi tạo hoặc sửa tài liệu chi tiết.

