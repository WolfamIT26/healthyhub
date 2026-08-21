# API Specification ChangeLog / Nhật ký thay đổi API Specification

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
