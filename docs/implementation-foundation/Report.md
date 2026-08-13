# Report / Báo cáo

## Task / Nhiệm vụ

Prompt 14 - Implementation Foundation & Workspace Setup.

## Summary / Tóm tắt

Đã chuyển HealthyHub từ framework tài liệu/specification sang workspace foundation có thể build. Phần đã tạo chỉ là nền tảng kỹ thuật, chưa triển khai nghiệp vụ.

## Development Port Update / Cập nhật port development — 2026-08-13

- `.env.development` tại workspace root là nguồn file chính cho Vite, NestJS và Docker scripts.
- Vite bind `WEB_PORT=3100`, bật `strictPort` và không còn CLI/config hard-code `3000`.
- NestJS bind `API_PORT=3001` sau khi `ConfigModule` nạp và validate raw env bằng `HealthyHubEnvironment`.
- HTTP smoke pass cho Web `3100`, API live `3001` và credentialed CORS origin `http://localhost:3100`.
- Không thay đổi business logic, API contract, Authentication, Payment, Checkout, VNPAY hoặc database.

## Added / Đã thêm

- Root config: `.gitattributes`, `.dockerignore`, `.prettierrc.json`, `.prettierignore`, `eslint.config.mjs`, `tsconfig.base.json`, `package-lock.json`.
- Workspace scripts trong `package.json`.
- Shared packages: `packages/shared-types`, `packages/shared-utils`, `packages/shared-config`.
- API foundation trong `apps/api`.
- Web foundation trong `apps/web`.
- Dockerfiles cho API/Web và Docker Compose stack.
- Scripts kiểm tra OpenAPI, docs, secret và Docker startup.
- CI workflows chạy install, lint, typecheck, test, build và validation nền.
- Tài liệu `docs/implementation-foundation`.

## Updated / Đã cập nhật

- Root `README.md`.
- `CAU_TRUC_THU_MUC.md`.
- `docs/README.md`.
- `docs/01-folder-structure.md`.
- `docs/18-framework-inventory.md`.
- `docs/framework-audit-report.md`.
- `CHANGELOG.md`.
- `TONG_HOP_DA_LAM.md`.
- `SECURITY.md`.
- `docs/development-standards/environment-standard.md`.
- `docs/development-standards/docker-standard.md`.
- `apps/api/README.md`.
- `apps/web/README.md`.
- `docs/work-summaries/README.md`.

## Verification / Kiểm tra

| Check | Kết quả | Ghi chú |
| --- | --- | --- |
| `npm install` | Pass | Dependency đã cài bằng npm workspace |
| `npm run format` | Pass | Đã format source/config trong phạm vi Prettier |
| `npm run format:check` | Pass | Tất cả file được check dùng đúng Prettier |
| `npm run lint` | Pass | ESLint không báo lỗi |
| `npm run typecheck` | Pass | API, Web và shared packages không lỗi TypeScript |
| `npm run test` | Pass | Chưa có test file; Vitest chạy với `--passWithNoTests` |
| `npm run test:integration` | Pass | Chưa có integration test file; dùng `--passWithNoTests` |
| `npm run build` | Pass | Build shared packages, API và Web thành công |
| `npm run openapi:validate` | Pass | 194 operation, 194 operationId unique, 194 dòng spec map |
| `npm run docs:check` | Pass | 8 tài liệu bắt buộc tồn tại |
| `npm run secrets:check` | Pass | Không phát hiện dấu hiệu secret thật trong phạm vi quét |
| `git diff --check` | Pass | Không có whitespace error |
| `npm run dev:web` | Pass | Vite trả HTTP 200 tại `127.0.0.1:3100`; strict-port collision fail rõ |
| `npm run dev:api` | Pass | NestJS log `api_started` port `3001`; live health trả HTTP 200 |
| `docker compose --env-file .env.development config --quiet` | Pass | Web `3100:3100`, API `3001:3001`, URL/origin đúng env |
| `npm run docker:up` | Blocked | Docker daemon chưa chạy |
| `npm run docker:check` | Blocked | Endpoint fail vì Docker Compose chưa khởi động |
| `npm run audit:deps` | Needs follow-up | Audit chạy được bằng registry npm chính thức, còn 4 high vulnerabilities |
| `npm audit fix` | Partial | Đã chạy sau khi dọn npm cache; giảm audit từ 9 xuống 4 vulnerabilities |

## Risks / Rủi ro

- Ổ đĩa local hiện còn dung lượng rất thấp, Docker build/start và dependency update lớn có thể thất bại vì thiếu dung lượng.
- Chưa có test nghiệp vụ vì chưa triển khai module nghiệp vụ.
- Health ready phụ thuộc MySQL nên cần Docker/MySQL hoặc database local để pass hoàn toàn.
- Dependency audit còn báo 4 high vulnerabilities ở `@nestjs/swagger`/`js-yaml` và React Router advisory range; cần xử lý tiếp khi upstream có bản vá phù hợp hoặc khi chấp nhận thay đổi version theo audit.

## Decision / Quyết định

Không thay đổi API Specification, Data Contract hoặc Physical Database Design. Foundation code bám theo contract hiện có và chỉ tạo các điểm mở rộng cần thiết.
