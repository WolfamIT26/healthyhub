# API Mapping / Ánh xạ API Authentication V1

## Contract Status / Trạng thái contract

API Specification, Authentication Data Contract and OpenAPI are aligned at revision 1.1.0/public `v1`. Ten existing endpoints and operationIds are unchanged.

| Endpoint | Request/auth | Success response | Notes |
| --- | --- | --- | --- |
| POST register | email/password/fullName; Public | `AuthRegisterCreated` / 201 | optional idempotency key; Customer + pending verification |
| POST login | email/password; Public | `AuthLoginOk` / 200 | access JSON; Web refresh cookie; invalid login 401 generic |
| POST refresh | Web cookie+CSRF OR Mobile header | `AuthRefreshOk` / 200 | no body; atomic rotation/reuse revoke |
| POST logout | Bearer owner | `AuthActionOk` / 200 | idempotent; clear cookie |
| POST verify-email | one-time body token | `AuthActionOk` / 200 | 24h, single use |
| POST resend-verification | email, optional Bearer | `AuthActionOk` / 200 | enumeration-safe accepted |
| POST forgot-password | email, Public | `AuthActionOk` / 200 | enumeration-safe accepted |
| POST reset-password | token + new password | `AuthActionOk` / 200 | 30m token; revoke all |
| POST change-password | current/new; Bearer owner | `AuthActionOk` / 200 | revoke others, rotate current |
| GET session | Bearer owner | `AuthSessionOk` / 200 | actor, roles, permissions/version |

Web cookie is `__Host-hh_refresh`, HttpOnly/Secure/SameSite=Lax/Path=/; Web JSON has no refresh token. Future Mobile may receive refresh only under its explicit client contract and sends `X-Refresh-Token`. Token responses are no-store.

Canonical errors follow `CATEGORY.AUTHENTICATION.REASON`: invalid credentials 401, token invalid/expired/revoked/reused 401, explicit authenticated permission/disabled 403, duplicate email 409, password policy 422, safe lock context 423, rate limit 429. Invalid/expired/used reset token is collapsed into `AUTH.AUTHENTICATION.RESET_TOKEN_INVALID`/400.

Adjacent User API retains account status/RBAC ownership. No V1 endpoint was added.
