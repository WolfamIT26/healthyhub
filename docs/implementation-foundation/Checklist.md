# Checklist / Danh sách kiểm tra

## Workspace / Workspace

- [x] Root `package.json` dùng npm workspaces.
- [x] Có workspace/build configuration.
- [x] Có TypeScript base configuration.
- [x] Có ESLint và Prettier configuration.
- [x] Có `.env.*.example`, không có secret thật.

## Backend / Backend

- [x] NestJS bootstrap.
- [x] Environment validation.
- [x] TypeORM MySQL configuration.
- [x] API prefix và versioning.
- [x] Global validation pipe.
- [x] Exception filter.
- [x] Response envelope.
- [x] Request ID và trace ID.
- [x] Structured logging và log redaction.
- [x] CORS, Helmet, body limit.
- [x] Rate-limit foundation.
- [x] Health check.
- [x] Swagger/OpenAPI integration.
- [x] Gateway contracts.
- [x] Graceful shutdown.

## Frontend / Frontend

- [x] React + Vite + TypeScript.
- [x] Tailwind CSS.
- [x] React Router.
- [x] Axios client.
- [x] Environment config.
- [x] Public, customer và admin layout.
- [x] Route guard foundation.
- [x] Error boundary.
- [x] Loading, empty state và toast foundation.
- [x] API error normalization.
- [x] Giao diện shell tiếng Việt.

## Database / Database

- [x] TypeORM config.
- [x] Data source config.
- [x] Migration/seed script foundation.
- [x] Transaction runner.
- [x] Base audit entity.
- [x] `synchronize` mặc định tắt ngoài test.

## Docker and CI / Docker và CI

- [x] Dockerfile API.
- [x] Dockerfile Web.
- [x] Compose có web, API, MySQL, phpMyAdmin.
- [x] Healthcheck, named volume và network.
- [x] GitHub Actions CI/test/deploy baseline.

## Verification / Kiểm tra chạy thật

- [x] `.env.development` được resolve từ workspace root cho Web và API.
- [x] `WEB_PORT` điều khiển Vite; `strictPort` fail rõ khi `3100` bị chiếm.
- [x] `API_PORT` điều khiển NestJS listener qua `HealthyHubEnvironment`.
- [x] Compose listener/mapping/healthcheck dùng `WEB_PORT` và `API_PORT`.
- [x] APP URL, API base URL, CORS và Authentication origins đồng bộ `3100`/`3001`.

- [x] Format check pass.
- [x] Lint pass.
- [x] Typecheck pass.
- [x] Test pass.
- [x] Integration test pass.
- [x] Build pass.
- [x] OpenAPI validation pass.
- [x] Docs check pass.
- [x] Secret check pass.
- [x] `git diff --check` pass.
- [x] Web start pass tại `3100`.
- [x] API start/live health pass tại `3001`.
- [ ] MySQL/phpMyAdmin/Docker health pass. Blocked: Docker daemon chưa chạy.
- [ ] Dependency audit sạch. Needs follow-up: đã giảm từ 9 xuống 4 high vulnerabilities, còn cần xử lý `@nestjs/swagger`/`js-yaml` và React Router advisory range.
