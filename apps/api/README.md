# API App / Ứng dụng API

## Purpose / Mục tiêu

Thư mục này dành cho backend HealthyHub.

## Stack / Công nghệ

- Node.js.
- TypeScript.
- NestJS.
- MySQL.
- TypeORM.

## Current Status / Trạng thái hiện tại

Đã có NestJS API foundation, chưa có code nghiệp vụ.

Foundation hiện có:

- Bootstrap API trong `src/main.ts`.
- Config validation trong `src/config/environment.ts`.
- TypeORM config trong `src/database`.
- Health endpoints trong `src/presentation/health`.
- Exception filter, response envelope, request context, logging, rate-limit foundation trong `src/common`.
- Gateway contract/base structure trong `src/gateways`.

Authentication data foundation hiện có:

- Hai TypeORM migrations cho User identity/RBAC và bốn bảng Authentication.
- Chín entities trong `src/data/user` và `src/data/authentication`.
- Authentication repository abstraction/TypeORM implementation và idempotent role/permission seed.
- Chưa có AuthController/AuthService hoặc endpoint runtime.

Tài liệu vận hành nằm tại `docs/implementation-foundation/README.md`.
