# ChangeLog / Nhật ký thay đổi Authentication

## [Unreleased] / Chưa phát hành

### Added / Thêm mới

- 2026-08-06: Tạo Context Pack Authentication gồm requirement, flow, rules, security, database, API, frontend, backend, testing, acceptance, dependency, plan và governance documents.
- 2026-08-06: Ghi mapping 10 endpoint, 4 bảng, actor/RBAC và shared contracts.
- 2026-08-06: Approved 10 P0 decisions về password, token, cookie/CSRF, account protection, response/error, tenant và retention.
- 2026-08-06: Thêm 2 TypeORM migrations, 9 entities, Authentication repository foundation, idempotent RBAC seed và 8 data-layer unit tests.
- 2026-08-06: Thêm Authentication shared contracts/enums/constants trong `packages/shared-types`.

### Changed / Thay đổi

- 2026-08-06: Cập nhật module index và work-summary index để đăng ký Context Pack.
- 2026-08-06: Đồng bộ Data Contract, API/flow, physical DB, UI Contract và OpenAPI; chuyển module sang `Ready for Implementation`.
- 2026-08-06: Chuyển trạng thái Prompt 16 sang `Implementation Complete - Database Verification Blocked` do Docker/MySQL chưa hoạt động.

### Fixed / Sửa lỗi

- Đổi Vitest config API sang `.mts` để test runner tương thích dependency ESM hiện tại; không đổi dependency.
# Change Log

## 2026-08-06 — Prompt 17

- Implemented Authentication NestJS controller, service, DTOs, guards, decorators and token/crypto layers.
- Added secure cookie/mobile refresh delivery, CSRF validation, RBAC foundation, account lock and audit events.
- Added notification gateway adapter and backend security unit tests.
- OpenAPI, `.spec`, frontend, Redis and Kafka remain unchanged.

## 2026-08-07 — Login User-Agent overflow fix

- Fixed `login_attempts.user_agent_family` overflow by persisting a bounded browser/client family instead of truncated raw User-Agent.
- Added regression coverage for Chrome, Safari, Firefox, Edge, missing and abnormal User-Agent values, plus failed-login attempt persistence.
- Kept the existing `VARCHAR(100)` migration/entity definition unchanged because specification and schema already match.

## 2026-08-07 — Prompt 18 Authentication Frontend

- Added Authentication pages, API client, memory session context/store, refresh handling and route guards.
- Added HttpOnly-cookie-compatible credential transport, CSRF header mirroring and `X-Client-Platform: web`.
- Added 18 frontend tests covering forms, restore, guards, refresh and safe errors.
- Recorded backend reset-cookie mismatch and full integration fixture blocker without changing backend/OpenAPI/policy.

## 2026-08-07 — Prompt 18.1 Unified Authentication Visual Design

- Unified all standalone Authentication pages and related states on `Authentication Banner.png`.
- Replaced the split panel with a responsive translucent floating card, preserving the right-side mascot/key visual.
- Enlarged in-card HealthyHub branding and retained contextual state illustrations with accessible image behavior.
- Removed obsolete login/register/Hero banner imports without deleting or renaming repository assets.
- Preserved Authentication behavior, API calls, routes, accessibility and Tailwind conventions.

## 2026-08-07 — Prompt 18.2 Centered Authentication Card

- Centered every Authentication card horizontally and vertically across desktop, laptop, tablet and mobile.
- Changed the Authentication banner from cropped `cover` rendering to aspect-ratio-preserving `contain` rendering over a matching gradient.
- Added a subtle five-second animated green conic-gradient glow with a static reduced-motion fallback.
- Made the Authentication hero consume the viewport remainder through layout flex sizing rather than a hardcoded header-height offset.
- Preserved Authentication logic, validation, API calls, routing, session handling and assets.

## 2026-08-07 — Prompt 18.3 Password UX & Policy

- Added a shared accessible show/hide password field to Login, Register and Reset Password forms.
- Added one shared password-policy helper used by frontend UX and authoritative backend Register/Reset/Change flows.
- Rejected small common-password deny-list entries and case-insensitive email-derived terms without banning `@`, `.`, or other valid symbols generally.
- Added frontend component/form/policy tests and backend flow/policy tests; Login credential verification remains unchanged.

## 2026-08-07 — Prompt 18.6 Customer vs Internal Email Verification

- Allowed pending unverified Customer accounts to login/refresh with normal JWT/session issuance and `actor.isEmailVerified=false`.
- Required verified email before Internal login and before Forgot/Reset/Change Password using one reusable backend policy.
- Added explicit `AUTH.EMAIL_NOT_VERIFIED` handling without changing JWT/session/schema/OpenAPI.
- Added Customer verification banner with verify, resend, temporary dismiss and development-only mail guidance.
- Opened the existing verify-email page to authenticated Customers and added unverified Forgot Password guidance.
