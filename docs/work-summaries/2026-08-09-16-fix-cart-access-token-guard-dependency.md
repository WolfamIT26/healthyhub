# Fix — CartModule AccessTokenGuard Dependency Resolution

## Root cause

`AuthenticationModule` sở hữu `AuthenticationTokenService`, `AUTHENTICATION_REPOSITORY` và `AccessTokenGuard`, nhưng chỉ export guard/repository. Khi guard được dùng tại Cart consumer boundary, Nest không nhìn thấy token service dependency trong public module boundary.

## Fix

Export instance `AuthenticationTokenService` từ `AuthenticationModule`. Cart, Order và Checkout tiếp tục import `AuthenticationModule`; không module nào redeclare token service, guard hoặc authentication repository. JWT/session/Cart behavior không đổi.

## Verification

- API typecheck/lint: pass.
- API tests: 22 files / 108 tests pass.
- Full build: pass.
- Dev bootstrap: `Nest application successfully started`.
- `GET http://localhost:3001/api/v1/health`: HTTP 200, MySQL up.
