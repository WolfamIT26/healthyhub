# Development Standards Index / Mục lục chuẩn phát triển

## Purpose / Mục tiêu

`docs/development-standards` là nguồn chuẩn duy nhất để Codex, AI Agent và developer sinh code HealthyHub đồng bộ, bảo mật, dễ bảo trì và đúng cấu trúc dự án.

Prompt 12.5 chỉ tạo rule, guideline, checklist và template phục vụ giai đoạn phát triển sau. Không viết code nghiệp vụ, không tạo API endpoint, không tạo database migration, không tạo frontend/backend implementation.

## Fixed Technology Stack / Stack cố định

| Area / Khu vực | Standard / Chuẩn |
| --- | --- |
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| Backend | Node.js, NestJS, TypeScript |
| Database | MySQL |
| Tools | Docker, Docker Compose, phpMyAdmin, Git, GitHub |

Không tự ý thay đổi hoặc bổ sung framework chính nếu chưa có ADR/Decision được duyệt.

## Reading Order / Thứ tự đọc

1. [Coding Standards / Chuẩn code](coding-standards.md).
2. [TypeScript Style Guide / Chuẩn TypeScript](typescript-style-guide.md).
3. [React Style Guide / Chuẩn React](react-style-guide.md).
4. [Tailwind Style Guide / Chuẩn Tailwind](tailwind-style-guide.md).
5. [NestJS Style Guide / Chuẩn NestJS](nestjs-style-guide.md).
6. [MySQL Style Guide / Chuẩn MySQL](mysql-style-guide.md).
7. [API Implementation Standard / Chuẩn triển khai API](api-implementation-standard.md).
8. [Data Contract Implementation / Triển khai Data Contract](data-contract-implementation.md).
9. [Gateway Standard / Chuẩn Gateway](gateway-standard.md).
10. [Folder Convention / Quy ước thư mục](folder-convention.md).
11. [Naming Convention / Quy ước đặt tên](naming-convention.md).
12. [Import Export Convention / Quy ước import/export](import-export-convention.md).
13. [Error Handling Standard / Chuẩn xử lý lỗi](error-handling-standard.md).
14. [Logging Standard / Chuẩn logging](logging-standard.md).
15. [Validation Standard / Chuẩn validation](validation-standard.md).
16. [Security Standard / Chuẩn bảo mật](security-standard.md).
17. [Performance Standard / Chuẩn hiệu năng](performance-standard.md).
18. [Accessibility Standard / Chuẩn accessibility](accessibility-standard.md).
19. [SEO Standard / Chuẩn SEO](seo-standard.md).
20. [Testing Standard / Chuẩn kiểm thử](testing-standard.md).
21. [Documentation Standard / Chuẩn tài liệu](documentation-standard.md).
22. [Environment Standard / Chuẩn môi trường](environment-standard.md).
23. [Docker Standard / Chuẩn Docker](docker-standard.md).
24. [Git Workflow / Quy trình Git](git-workflow.md).
25. [Branching Strategy / Chiến lược nhánh](branching-strategy.md).
26. [Commit Convention / Quy ước commit](commit-convention.md).
27. [Code Review Standard / Chuẩn review code](code-review-standard.md).
28. [Dependency Management / Quản lý dependency](dependency-management.md).
29. [Versioning Release Standard / Chuẩn version và release](versioning-release-standard.md).
30. [AI Code Generation Rules / Quy tắc AI sinh code](ai-code-generation-rules.md).
31. [Vertical Slice Workflow / Workflow phát triển lát cắt dọc](vertical-slice-workflow.md).
32. [Module Done Definition / Định nghĩa hoàn thành module](module-done-definition.md).
33. [Templates / Mẫu dùng cho phát triển](templates/README.md).

## Required Output After Development / Đầu ra bắt buộc sau khi phát triển

Sau mỗi task phát triển module, AI Agent phải cập nhật:

- `Status.md`.
- `Report.md`.
- `Checklist.md`.
- `ChangeLog.md`.
- `TODO.md` nếu còn việc mở.
- `Decision.md` nếu có quyết định mới.

Nếu thay đổi database, API, UI, architecture hoặc security thì phải cập nhật đúng specification/tài liệu liên quan trước khi báo hoàn thành.

## Templates / Mẫu liên quan

- [Development Task Report Template / Mẫu báo cáo task phát triển](templates/development-task-report-template.md).
- [Module Implementation Checklist Template / Mẫu checklist triển khai module](templates/module-implementation-checklist-template.md).
- [Code Review Report Template / Mẫu báo cáo review code](templates/code-review-report-template.md).

## Status Files / File trạng thái

- [Status](Status.md).
- [Report](Report.md).
- [Checklist](Checklist.md).
- [ChangeLog](ChangeLog.md).
