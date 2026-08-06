# OpenAPI ChangeLog / Lịch sử thay đổi OpenAPI

## 2026-08-06 - Authentication V1.1

- Added dedicated register/login/refresh/session/action schemas, responses and safe examples.
- Web refresh uses `RefreshCookieAuth` + `CsrfTokenAuth`; Mobile retains `RefreshTokenAuth`; removed ambiguous refresh body.
- Added token/cookie no-store behavior, password length 12–128, canonical auth errors and endpoint-specific success responses.
- Kept 10 Authentication operations and existing operationIds/routes.

## 2026-08-06

- Added OpenAPI 3.1 Specification root at `openapi/openapi.yaml`.
- Added shared schemas, responses, parameters, examples and security schemes.
- Added provider webhook contracts for payment, shipping and notification.
- Added endpoint domain map for 23 domains and 194 operations.
