# Implementation Plan / Kế hoạch triển khai Authentication

## Global Gate / Cổng chung

P0 gate đã đạt ngày 2026-08-06; upstream specs/OpenAPI đã đồng bộ. Mọi task vẫn phải đọc `modules/authentication/README.md`, file chủ đề tương ứng và Security Rules. Đường dẫn dưới đây là allowlist dự kiến; không mở rộng domain hoặc tự đổi approved policy.

| # / Task | Input cần đọc | Files được phép tạo/sửa | Dependency | Acceptance criteria | Verification command |
| --- | --- | --- | --- | --- | --- |
| 1 Database migration/entity | `Database.md`, approved physical/User specs, base audit/typeorm | `apps/api/src/database/migrations/*`, `apps/api/src/data/authentication/*`, entity registration | P0 DB/tenant/retention decisions | 4 auth tables, approved refresh fields, FK/index/check/audit đúng; no raw token | `npm -w @healthyhub/api run migration:show && npm -w @healthyhub/api run typecheck` |
| 2 Shared contracts | `API.md`, `Dependency.md`, updated OpenAPI/data contracts | `packages/shared-types/src/*`, exports/tests | Task 1 contract decisions | request/response/session/token/RBAC/error types match canonical contract | `npm -w @healthyhub/shared-types run typecheck && npm -w @healthyhub/shared-types test` |
| 3 Backend security foundation | `Security.md`, `Backend.md`, security baseline | auth config/crypto/token/guards/audit/rate-limit files in `apps/api/src`; env examples only if approved | 1–2, PD-01..08 | KDF/JWT/rotation/revocation/RBAC abstractions, redaction, tier limits; no secret defaults | `npm -w @healthyhub/api run lint && npm -w @healthyhub/api test` |
| 4 Register | register flow, User/Notification contracts | auth register controller/use-case/DTO/repo adapter/tests | 1–3, User/Notification | Customer only, duplicate race safe, verification queued, 201 contract | `npm -w @healthyhub/api test -- register` |
| 5 Login | login flow/account rules | auth login handler/DTO/tests | 1–4, lock policy | generic errors, attempt tracking, account checks, session/tokens | `npm -w @healthyhub/api test -- login` |
| 6 Refresh token | refresh flow/security/DB | refresh handler/rotation repo/tests | 1–5 | atomic rotation, expiry/revoke/reuse detection, single transport | `npm -w @healthyhub/api test -- refresh` |
| 7 Logout/revocation | logout/revoke flows | logout/revocation handlers/tests | 6 | idempotent logout; revoked session cannot refresh | `npm -w @healthyhub/api test -- logout` |
| 8 Forgot/reset password | reset flows/UI contract | handlers/DTO/notification/tests | 3, User/Notification | generic forgot; one-time reset; revoke policy; audit | `npm -w @healthyhub/api test -- password-reset` |
| 9 Current session | API/current type | session query/controller/tests | 2–7 | actor/roles/effective permissions/token metadata; no secrets | `npm -w @healthyhub/api test -- session` |
| 10 Change password | change flow/security | handler/DTO/tests | 5,7, PD-11 | current credential verified; policy enforced; revoke/audit | `npm -w @healthyhub/api test -- change-password` |
| 11 Role/permission guard | actor matrix, User API contracts | auth/RBAC guards/decorators/tests; User adapter only | 2,3,9 | 401/403 correct; tenant/role/effective permission backend-enforced | `npm -w @healthyhub/api test -- authorization` |
| 12 Frontend forms/guards | `Frontend.md`, updated OpenAPI/shared types | `apps/web/src/modules/authentication/*`, auth pages/routes/services/tests | 2,4–11 | Vietnamese accessible forms; safe token/session state; redirects/401/403/expiry | `npm -w @healthyhub/web run typecheck && npm -w @healthyhub/web test` |
| 13 Unit tests | `Testing.md`, implemented units | auth test files beside API/web/shared units | 1–12 | all listed unit cases including token state machine and redaction | `npm run test` |
| 14 Integration tests | DB/API contract/testing plan | `apps/api/tests/authentication/*` and test fixtures | 1–13 | transaction/race/rotation/revoke/audit/OpenAPI cases | `npm -w @healthyhub/api run test:integration` |
| 15 E2E tests | Acceptance/UI flows | `tests/e2e/authentication/*` or established E2E location | 12–14 | register-to-logout, reset, lock, guard, accessibility journeys | project-approved E2E command |
| 16 Security review | `Security.md`, threat model, dependency output | `security/reports/*`, module Report/Decision/TODO only | 1–15 | enumeration, replay, CSRF/CORS, escalation, secret/log tests pass; findings triaged | `npm run secrets:check && npm run audit:deps` |
| 17 Documentation update | all implemented contracts/results | `modules/authentication/*`, work summary/index, relevant generated docs | 16 | docs match shipped behavior; no unresolved drift | `npm run docs:check && npm run openapi:validate` |
| 18 Module lock | `Acceptance.md`, Checklist/Status/Report | module governance/status files only | all prior | all acceptance checked, no P0 blockers, CI green, owner approval | `npm run lint && npm run typecheck && npm run test && git diff --check` |

## Sequencing Note / Ghi chú thứ tự

Email verification implementation is included across Tasks 3–5 and 12–15 because current V1 specifications require it. Account status implementation belongs to User domain; Task 11 integrates authorization and session revocation without moving ownership.
