# HealthyHub / Khung phát triển AI Full Stack

HealthyHub là dự án mẫu đầu tiên sử dụng **AI Development Framework** cho hệ thống Full Stack thương mại. Giai đoạn này chỉ tạo khung dự án, tài liệu, quy tắc, template và workflow để các AI Agent khác phát triển tiếp về sau.

Không có code nghiệp vụ trong scaffold này.

## Purpose / Mục tiêu

- Chuẩn hóa cách AI Agent đọc ngữ cảnh, thiết kế, phát triển, kiểm thử và cập nhật tài liệu.
- Tạo nền tảng Web trước, Mobile App sau.
- Thiết kế theo Modular Monolith, chuẩn bị khả năng tách Microservice.
- Xem AI là một layer toàn hệ thống, không chỉ là một module riêng lẻ.
- Có thể tái sử dụng framework này cho nhiều dự án Full Stack khác.

## Stack / Công nghệ

- Frontend: React, Vite, TypeScript, Tailwind CSS.
- Backend: Node.js, NestJS, TypeScript.
- Database: MySQL, SQL.
- Tools: Docker, Git, GitHub, phpMyAdmin.

## Architecture / Kiến trúc

Các layer chính:

- Presentation Layer / Lớp giao diện.
- Gateway Layer / Lớp cổng tích hợp.
- Business Layer / Lớp nghiệp vụ.
- Data Layer / Lớp dữ liệu.
- AI Layer / Lớp AI toàn hệ thống.

Các gateway được chuẩn bị:

- AI Gateway.
- Payment Gateway.
- Storage Gateway.
- Notification Gateway.
- OCR Gateway.
- Vision Gateway.
- Analytics Gateway.
- Integration Gateway.

## AI Workflow / Quy trình cho AI Agent

Trước khi làm:

1. Đọc [Project Rules](docs/00-project-rules.md).
2. Đọc [Folder Structure](docs/01-folder-structure.md).
3. Đọc context trong [.ai/context](.ai/context/README.md).
4. Đọc module context liên quan nếu có.

Sau khi làm:

- Cập nhật `Status.md`.
- Cập nhật `Report.md`.
- Cập nhật `Checklist.md`.
- Cập nhật `ChangeLog.md`.
- Nếu thay đổi Database, API hoặc Architecture thì cập nhật tài liệu tương ứng.

## Development Workflow / Quy trình phát triển

Requirement → Architecture → Database Design → API Design → Frontend Design → Backend Development → Testing → Review → Documentation Update → Release.

## Start Here / Bắt đầu từ đây

- Quy tắc dự án: [docs/00-project-rules.md](docs/00-project-rules.md).
- Cấu trúc thư mục: [docs/01-folder-structure.md](docs/01-folder-structure.md).
- Foundation Documentation: [docs/foundation/README.md](docs/foundation/README.md).
- Business Blueprint: [docs/business-blueprint/README.md](docs/business-blueprint/README.md).
- Feature Specifications: [.spec/features/README.md](.spec/features/README.md).
- Domain Model: [.spec/domain/README.md](.spec/domain/README.md).
- Logical Database Design: [.spec/database/README.md](.spec/database/README.md).
- Physical Database Design: [.spec/database-physical/README.md](.spec/database-physical/README.md).
- Data Contract Specification: [.spec/data-contracts/README.md](.spec/data-contracts/README.md).
- API Specification: [.spec/api/README.md](.spec/api/README.md).
- OpenAPI Specification: [openapi/README.md](openapi/README.md).
- UI Contract Specification: [.spec/ui-contract/README.md](.spec/ui-contract/README.md).
- Design System: [docs/design-system/README.md](docs/design-system/README.md).
- Development Standards: [docs/development-standards/README.md](docs/development-standards/README.md).
- Implementation Foundation: [docs/implementation-foundation/README.md](docs/implementation-foundation/README.md).
- Tổng hợp sau mỗi lần làm: [docs/work-summaries/README.md](docs/work-summaries/README.md).
- Kiến trúc tổng quan: [docs/02-architecture.md](docs/02-architecture.md).
- AI Documentation: [docs/13-ai-documentation.md](docs/13-ai-documentation.md).
- Framework inventory: [docs/18-framework-inventory.md](docs/18-framework-inventory.md).
- Framework audit report: [docs/framework-audit-report.md](docs/framework-audit-report.md).
- Phase 2 enhancement report: [docs/framework-phase-2-enhancement-report.md](docs/framework-phase-2-enhancement-report.md).
- Module template: [.ai/templates/module/README.md](.ai/templates/module/README.md).

## Run Foundation / Chạy nền tảng

```bash
npm install
npm run build
npm run dev
```

Endpoint nền:

- Web: `http://localhost:3000`.
- API health: `http://localhost:3001/api/v1/health/live`.
- Swagger UI: `http://localhost:3001/api/docs`.
