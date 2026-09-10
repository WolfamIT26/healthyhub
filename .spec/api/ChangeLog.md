# API Specification ChangeLog / Nhật ký thay đổi API Specification

## 2026-08-27 — Prompt 35

- Opened Admin Product list/detail/options/create/update/status/delete as executable runtime API contracts.
- Added Product options and soft-delete operations, bringing inventory to 198.
- Kept Product media attach/import/export blocked and standalone Category/Brand Admin CRUD outside Prompt 35.

## 2026-08-25 — Prompt 34

- Opened the existing Admin Analytics Dashboard operation with exact aggregate-only response and server-derived tenant/role boundary.
- Kept 8 other Analytics operations design-only and 2 Admin Review moderation operations blocked.
- Operation inventory remains 196.

## 2026-08-21 — Prompt 33.2

- Opened 6 public/customer Review operations with exact pagination/request/response contracts.
- Kept 2 Admin moderation operations blocked; operation inventory remains 196.

## 2026-08-21 — Prompt 33.1

- Expanded canonical Customer Order status schemas without adding operations.
- Changed Review runtime blocker to missing persistence/API; eligibility is READY.

## [1.5.0] - 2026-08-21

- Marked all 8 Review operations contract-stage/runtime-blocked for Prompt 33.
- Kept operation inventory at 196 and did not add exact DTO schemas while eligibility is unresolved.

## [1.4.0] - 2026-08-21

- Recorded internal Prompt 32.1 Order/Payment stock lifecycle without adding a public/Admin Inventory operation.
- Operation inventory remains 196; Admin Inventory endpoints stay design-only.

## [1.3.0] - 2026-08-21

- Clarified Prompt 32 internal Inventory read authority and public quantity non-disclosure.
- Kept Admin Inventory operations design-only; no OpenAPI operation changed.

## [1.2.0] - 2026-08-13

- Refined executable Product public query, numeric-ID/slug detail, safe response and Inventory availability boundaries for Prompt 31.
- Refined Category/Brand public pagination, search, tree/detail and safe response contracts without adding operations.

## [1.1.0] - 2026-08-06

### Changed / Đã thay đổi

- Approved Authentication V1 token transport, lifetime, rotation/reuse, password/account policy, RBAC, response and canonical error behavior.
- Web refresh uses secure HttpOnly cookie + CSRF; future Mobile uses secure-storage refresh header on the same endpoint.
- Kept all 10 Authentication endpoints and `/api/v1`; removed ambiguous refresh request body and unnecessary idempotency requirements.

## [0.1.0] - 2026-08-06

### Added / Đã thêm

- Tạo API Specification tại `.spec/api`.
- Tạo API Index, API Conventions, API Security, Authentication Flow, Error Catalog, Domain API Map, Endpoint Matrix, Rate Limit Policy và Webhook Policy.
- Tạo API Specification cho 23 domain trong `.spec/api/domains`.
- Chuẩn hóa base URI `/api/v1`, namespace public/me/admin/ai/webhooks, method, status code, versioning, deprecation, trace ID và request ID.
- Chuẩn hóa JWT, refresh token, permission, role, API key policy, CORS và rate limiting.

### Notes / Ghi chú

- Không tạo OpenAPI hoặc Swagger.
- Không viết controller, service, repository, DTO code hoặc entity.
- Không viết SQL hoặc migration.
- Endpoint trong tài liệu là đặc tả thiết kế, chưa phải implementation.
