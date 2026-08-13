# OpenAPI ChangeLog / Lịch sử thay đổi OpenAPI

## 2026-08-13 - Customer Profile & Address V1

- Replaced generic Customer self schemas with typed Profile/Address contracts.
- Removed generic pagination/filter parameters from owner Profile/Address reads.
- Kept the operation inventory at 196 across 23 domains.

## 2026-08-12 - VNPAY Sandbox Verification Contract

- Documented required signed Return/IPN query parameters.
- Clarified browser return is read-only and IPN is authoritative.
- Kept the operation inventory at 196 across 23 domains.

## 2026-08-10 - VNPAY Sandbox Payment Contract

- Added Payment methods, VNPAY browser return and VNPAY IPN/callback operations.
- Updated Payment domain map from generic provider webhook to executable VNPAY sandbox callback.
- Operation count is now 196 across 23 domains.

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
