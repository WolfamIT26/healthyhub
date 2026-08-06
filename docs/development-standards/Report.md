# Development Standards Report / Báo cáo Development Standards

## Purpose / Mục tiêu

Báo cáo này tổng hợp kết quả Prompt 12.5: Generate Development Standards.

## Summary / Tóm tắt

Đã tạo `docs/development-standards` làm nguồn chuẩn thống nhất cho quá trình sinh code HealthyHub. Bộ tài liệu quy định TypeScript, React, Tailwind, NestJS, MySQL, API, Data Contract, Gateway, folder, naming, import/export, error, logging, validation, security, performance, accessibility, SEO, testing, documentation, environment, Docker, Git, dependency, release, AI code generation, vertical slice workflow, Definition of Done và template report/checklist/review.

## Design Decisions / Quyết định thiết kế

| Decision / Quyết định | Reason / Lý do |
| --- | --- |
| Khóa backend vào NestJS | Prompt 12.5 quy định backend dùng Node.js, NestJS và TypeScript. |
| Không tạo code sample | Prompt yêu cầu không viết code, không tạo endpoint, migration hoặc implementation. |
| Đặt standards trong `docs/development-standards` | Tạo một nguồn chuẩn duy nhất cho prompt sinh code sau này. |
| Bám Data Contract, API Spec, UI Contract và Design System | Đảm bảo frontend/backend/mobile/AI không tự suy đoán contract. |
| Ghi rõ AI Code Generation Rules | Giảm rủi ro AI quét repo quá rộng, sửa file không liên quan hoặc tự đổi stack. |

## Coverage / Mức bao phủ

| Area / Khu vực | Coverage / Bao phủ |
| --- | --- |
| Coding | Strict TypeScript, no any, trách nhiệm file/class/function, no hardcode. |
| Frontend | React feature/module, API service, form, state, accessibility, SEO, Design System. |
| Backend | NestJS Modular Monolith, layer, DTO, service, repository, guard, pipe, filter, gateway. |
| Database | MySQL naming, migration, seed, FK/index/audit, transaction, soft delete. |
| Gateway | AI, payment, storage, notification, OCR, vision, analytics, integration. |
| Security | Secret, auth, JWT, RBAC, validation, SQL Injection, XSS, CSRF, CORS, rate limit, audit. |
| Performance | Pagination, N+1, index, debounce, lazy loading, image optimization, timeout. |
| Testing | Unit, integration, API, E2E, security, responsive, accessibility. |
| Git/Release | Branch, commit, PR, review, dependency, versioning, release. |
| AI Workflow | Context minimal, no stack drift, diff review, documentation update. |
| Templates | Development task report, module implementation checklist, code review report. |

## Assumptions / Giả định

- HealthyHub chuyển backend option từ NestJS hoặc Express ở framework ban đầu sang NestJS theo Prompt 12.5.
- Công cụ lint/test/build cụ thể sẽ được quyết định ở phase implementation khi tạo code thật.
- Development Standards là chuẩn vận hành; nếu mâu thuẫn với specification mới hơn, cần ADR/Decision trước khi đổi.
