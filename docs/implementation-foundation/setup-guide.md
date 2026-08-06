# Setup Guide / Hướng dẫn setup

## Purpose / Mục tiêu

Tài liệu này hướng dẫn cách cài dependency và chạy workspace nền HealthyHub trên máy local. Đây là bước chuẩn bị trước khi phát triển module Authentication.

## Prerequisites / Điều kiện cần

- Node.js 22 hoặc phiên bản LTS tương thích với NestJS/Vite hiện tại.
- npm dùng theo lockfile `package-lock.json`.
- Docker Desktop hoặc Docker Engine nếu muốn chạy MySQL/phpMyAdmin bằng container.
- Không cần cài thêm framework ngoài stack đã khóa.

## Install / Cài dependency

Chạy tại thư mục gốc:

```bash
npm install
```

Dependency được quản lý bằng npm workspaces:

- `apps/api` cho NestJS API.
- `apps/web` cho React/Vite web.
- `packages/shared-types`, `packages/shared-utils`, `packages/shared-config` cho package dùng chung.

## Local Development / Chạy local

Chạy toàn bộ API và Web:

```bash
npm run dev
```

Chạy riêng API:

```bash
npm run dev:api
```

Chạy riêng Web:

```bash
npm run dev:web
```

Mặc định:

- Web: `http://localhost:3000`.
- API: `http://localhost:3001/api/v1`.
- Swagger UI: `http://localhost:3001/api/docs`.

## Build / Build toàn bộ

```bash
npm run build
```

Lệnh này build shared packages trước, sau đó build API và Web.

## Quality Checks / Kiểm tra chất lượng

Các lệnh nền:

```bash
npm run lint
npm run typecheck
npm run test
npm run openapi:validate
npm run docs:check
npm run secrets:check
```

Mỗi lệnh phải chạy thật trước khi báo hoàn thành. Nếu môi trường thiếu dung lượng, thiếu Docker hoặc thiếu service, ghi rõ vào `Report.md`.

## Development Rule / Quy tắc phát triển

- Không viết nghiệp vụ trực tiếp vào foundation nếu chưa có module spec.
- Không tạo endpoint ngoài OpenAPI/API Specification đã khóa.
- Không bật `TYPEORM_SYNCHRONIZE=true` ngoài môi trường test.
- Không commit file `.env` thật.
- Không log password, token, cookie, authorization header hoặc API key.
