    # Prompt 12.5 - Development Standards / Tổng hợp chuẩn phát triển

    ## Task / Nhiệm vụ

    Tạo Development Standards cho HealthyHub để Codex, AI Agent và developer sinh code đồng bộ ở các prompt sau.

    ## Summary / Tóm tắt

    Đã tạo `docs/development-standards` làm nguồn chuẩn duy nhất cho TypeScript, React, Tailwind, NestJS, MySQL, API, Data Contract, Gateway, security, performance, accessibility, SEO, testing, Git, Docker, dependency, release, AI code generation, vertical slice workflow và module Definition of Done.

    ## Added / Đã thêm

    - `docs/development-standards/README.md`
    - `docs/development-standards/coding-standards.md`
    - `docs/development-standards/typescript-style-guide.md`
    - `docs/development-standards/react-style-guide.md`
    - `docs/development-standards/tailwind-style-guide.md`
    - `docs/development-standards/nestjs-style-guide.md`
    - `docs/development-standards/mysql-style-guide.md`
    - `docs/development-standards/api-implementation-standard.md`
    - `docs/development-standards/data-contract-implementation.md`
    - `docs/development-standards/gateway-standard.md`
    - `docs/development-standards/folder-convention.md`
    - `docs/development-standards/naming-convention.md`
    - `docs/development-standards/import-export-convention.md`
    - `docs/development-standards/error-handling-standard.md`
    - `docs/development-standards/logging-standard.md`
    - `docs/development-standards/validation-standard.md`
    - `docs/development-standards/security-standard.md`
    - `docs/development-standards/performance-standard.md`
    - `docs/development-standards/accessibility-standard.md`
    - `docs/development-standards/seo-standard.md`
    - `docs/development-standards/testing-standard.md`
    - `docs/development-standards/documentation-standard.md`
    - `docs/development-standards/environment-standard.md`
    - `docs/development-standards/docker-standard.md`
    - `docs/development-standards/git-workflow.md`
    - `docs/development-standards/branching-strategy.md`
    - `docs/development-standards/commit-convention.md`
    - `docs/development-standards/code-review-standard.md`
    - `docs/development-standards/dependency-management.md`
    - `docs/development-standards/versioning-release-standard.md`
    - `docs/development-standards/ai-code-generation-rules.md`
    - `docs/development-standards/vertical-slice-workflow.md`
    - `docs/development-standards/module-done-definition.md`
    - `docs/development-standards/Status.md`
    - `docs/development-standards/Report.md`
    - `docs/development-standards/Checklist.md`
    - `docs/development-standards/ChangeLog.md`
    - `docs/development-standards/templates/README.md`
    - `docs/development-standards/templates/development-task-report-template.md`
    - `docs/development-standards/templates/module-implementation-checklist-template.md`
    - `docs/development-standards/templates/code-review-report-template.md`
    - `docs/architecture/adr/ADR-006-backend-framework-nestjs.md`

    ## Updated / Đã cập nhật

    - `README.md`
    - `docs/README.md`
    - `docs/01-folder-structure.md`
    - `docs/00-project-rules.md`
    - `.ai/context/technology-stack.md`
    - `docs/foundation/project/project-overview.md`
    - `docs/architecture/adr/README.md`
    - `CAU_TRUC_THU_MUC.md`
    - `TONG_HOP_DA_LAM.md`
    - `CHANGELOG.md`
    - `docs/18-framework-inventory.md`
    - `docs/work-summaries/README.md`

    ## Not Changed / Không thay đổi

    - Không viết code nghiệp vụ.
    - Không tạo API endpoint.
    - Không tạo database migration.
    - Không tạo frontend/backend implementation.
    - Không thêm dependency hoặc framework ngoài stack cố định của Prompt 12.5.
    - Backend stack được khóa là Node.js, NestJS và TypeScript theo Prompt 12.5, đã ghi ADR-006.

    ## Verification / Kiểm tra

    - Kiểm tra `docs/development-standards` chỉ có Markdown.
    - Kiểm tra đủ toàn bộ file bắt buộc của Prompt 12.5.
    - Kiểm tra có thêm template report/checklist/review liên quan.
    - Kiểm tra không có code fence hoặc dấu hiệu implementation code.
    - Kiểm tra Markdown bằng `git diff --check`.

    ## Notes / Ghi chú

    Prompt sinh code sau này nên đọc `docs/development-standards/README.md`, `ai-code-generation-rules.md`, `vertical-slice-workflow.md`, `module-done-definition.md` và standard chuyên môn tương ứng trước khi triển khai.
