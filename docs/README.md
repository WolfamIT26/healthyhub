# Documentation / Tài liệu dự án

Thư mục `docs` lưu toàn bộ tài liệu nền tảng của HealthyHub và AI Development Framework.

## Reading Order / Thứ tự đọc

1. [Project Rules / Quy tắc dự án](00-project-rules.md).
2. [Folder Structure / Cấu trúc thư mục](01-folder-structure.md).
3. [Foundation Documentation / Tài liệu nền tảng](foundation/README.md).
4. [Business Blueprint / Bản thiết kế nghiệp vụ](business-blueprint/README.md).
5. [Feature Specifications / Đặc tả tính năng](../.spec/features/README.md).
6. [Domain Model / Mô hình domain](../.spec/domain/README.md).
7. [Logical Database Design / Thiết kế database logic](../.spec/database/README.md).
8. [Physical Database Design / Thiết kế database vật lý](../.spec/database-physical/README.md).
9. [Data Contract Specification / Đặc tả chuẩn dữ liệu](../.spec/data-contracts/README.md).
10. [API Specification / Đặc tả API](../.spec/api/README.md).
11. [OpenAPI Specification / Đặc tả OpenAPI](../openapi/README.md).
12. [UI Contract Specification / Đặc tả hợp đồng UI](../.spec/ui-contract/README.md).
13. [Design System / Hệ thống thiết kế](design-system/README.md).
14. [Development Standards / Chuẩn phát triển](development-standards/README.md).
15. [Implementation Foundation / Nền tảng triển khai](implementation-foundation/README.md).
16. [Architecture / Kiến trúc](02-architecture.md).
17. [Requirement / Yêu cầu](03-requirement.md).
18. [AI Documentation / Tài liệu AI](13-ai-documentation.md).
19. [Framework Inventory / Kiểm kê framework](18-framework-inventory.md).
20. [Framework Audit Report / Báo cáo audit framework](framework-audit-report.md).
21. [Phase 2 Enhancement Report / Báo cáo mở rộng Phase 2](framework-phase-2-enhancement-report.md).
22. [Work Summaries / Tổng hợp sau mỗi lần làm](work-summaries/README.md).

## Foundation Documentation / Tài liệu nền tảng

Foundation Documentation là bộ tài liệu chuẩn của Prompt 03, dùng làm nguồn tham chiếu thống nhất trước khi tạo đặc tả tính năng hoặc code:

- [Project / Dự án](foundation/project/README.md).
- [Architecture / Kiến trúc](foundation/architecture/README.md).
- [Standards / Tiêu chuẩn](foundation/standards/README.md).
- [Development / Phát triển](foundation/development/README.md).
- [Security / Bảo mật](foundation/security/README.md).
- [Performance / Hiệu năng](foundation/performance/README.md).
- [Testing / Kiểm thử](foundation/testing/README.md).
- [Deployment / Triển khai](foundation/deployment/README.md).
- [AI / Trí tuệ nhân tạo](foundation/ai/README.md).
- [Decision Record / Nhật ký quyết định](foundation/decision-record/README.md).

## Work Summaries / Tổng hợp sau mỗi lần làm

Các bản tổng hợp sau mỗi nhiệm vụ được gom tại [docs/work-summaries](work-summaries/README.md) để người dùng dễ kiểm tra lại thay đổi theo từng lần làm.

## Business Blueprint / Bản thiết kế nghiệp vụ

Business Blueprint nằm tại [docs/business-blueprint](business-blueprint/README.md), dùng làm nền trước khi tạo feature spec, thiết kế hệ thống, database, API hoặc UI.

## Feature Specifications / Đặc tả tính năng

Feature Specifications nằm tại [.spec/features](../.spec/features/README.md), dùng làm đầu vào cho Database Design, API Design, UI Design và Module Development trong các prompt sau.

## Domain Model / Mô hình domain

Domain Model nằm tại [.spec/domain](../.spec/domain/README.md), dùng để chuẩn hóa ranh giới domain, aggregate, entity, value object, business rule, domain event và dependency trước khi thiết kế database hoặc API.

## Logical Database Design / Thiết kế database logic

Logical Database Design nằm tại [.spec/database](../.spec/database/README.md), dùng để mô tả entity, PK, FK, relationship, cardinality, lifecycle, ownership và data dictionary trước khi thiết kế physical database.

## Physical Database Design / Thiết kế database vật lý

Physical Database Design nằm tại [.spec/database-physical](../.spec/database-physical/README.md), dùng để chuẩn hóa table, column, MySQL type, constraint, index, migration strategy và backup/recovery trước khi sinh migration.

## Data Contract Specification / Đặc tả chuẩn dữ liệu

Data Contract Specification nằm tại [.spec/data-contracts](../.spec/data-contracts/README.md), dùng để chuẩn hóa request, response, API envelope, pagination, filter, search, sort, upload/download, import/export, error, validation, AI response, metadata, enum và versioning trước khi thiết kế API endpoint.

## API Specification / Đặc tả API

API Specification nằm tại [.spec/api](../.spec/api/README.md), dùng để thiết kế REST endpoint, method, URI, permission, authentication, authorization, request/response/error contract, validation, business rule, pagination, filter, search, sort, upload/download, rate limit, idempotency, webhook và AI endpoint trước khi sinh OpenAPI hoặc code.

## OpenAPI Specification / Đặc tả OpenAPI

OpenAPI Specification chính thức nằm tại [openapi](../openapi/README.md), dùng để mô tả contract OpenAPI 3.1 cho 194 operation thuộc 23 domain, gồm schema, response, parameter, security, example và webhook.

## UI Contract Specification / Đặc tả hợp đồng UI

UI Contract Specification nằm tại [.spec/ui-contract](../.spec/ui-contract/README.md), dùng để chuẩn hóa màn hình, route, permission, required API, required data, UI sections, component mapping, form, validation, search/filter/sort/pagination, upload/download, UI states, responsive, accessibility và SEO metadata trước khi thiết kế Design System hoặc Frontend.

## Design System / Hệ thống thiết kế

Design System nằm tại [docs/design-system](design-system/README.md), dùng để chuẩn hóa principles, tokens, color palette, typography, spacing, radius, elevation, shadow, grid, breakpoints, icon, illustration, motion, dark mode, accessibility và component library trước khi thiết kế UI hoặc viết frontend.

## Development Standards / Chuẩn phát triển

Development Standards nằm tại [docs/development-standards](development-standards/README.md), dùng làm chuẩn sinh code cho TypeScript, React, Tailwind, NestJS, MySQL, API, Data Contract, Gateway, security, performance, testing, Git, release, AI code generation và Definition of Done.

## Implementation Foundation / Nền tảng triển khai

Implementation Foundation nằm tại [docs/implementation-foundation](implementation-foundation/README.md), dùng để chạy workspace nền gồm React/Vite web, NestJS API, shared packages, Docker Compose, CI và các script kiểm tra trước khi làm module Authentication.

## Rule / Quy tắc

Mọi thay đổi về nghiệp vụ, database, API, kiến trúc, bảo mật hoặc triển khai phải được phản ánh lại trong tài liệu tương ứng.
