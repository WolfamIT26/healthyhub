# Use Cases & Flows / Use case và luồng Authentication

## Flow Matrix / Ma trận luồng

Mỗi dòng bao gồm precondition (Pre), input, xử lý, output, security, failure, audit và rate limit.

| Flow | Pre & Input | Processing & Output | Security & Failure | Audit & Rate limit |
| --- | --- | --- | --- | --- |
| Register | Guest; email, password, fullName, optional phone/consent | Validate, normalize, ensure eligibility/uniqueness, hash password, create Customer, issue verification; `201` safe envelope | Không cho chọn role; duplicate/validation/notification failure; không echo password | registered/verification_sent; Very Strict theo IP+identifier; idempotency key theo OpenAPI |
| Login | Public; email + password | Rate check, lookup, constant-time credential verification, account-state check, create session/token; `200` auth payload | Generic invalid credential; locked/disabled/unverified/rate-limited; chống timing enumeration | success/failure/locked/session_created; Very Strict IP+identifier |
| Refresh | Active session; refresh token | Verify hash/session/account, detect reuse, rotate atomically, issue access + refresh metadata | Invalid/expired/revoked/reused/account locked; old token invalidated | token_refreshed/reuse/session_revoked; Strict; idempotency semantics cần chốt |
| Logout | JWT/session owner | Resolve current session, revoke token family/session; safe `200` even already revoked | Invalid actor/session; no raw token log | logout/session_revoked; Strict; idempotent |
| Forgot password | Public; email | Validate, always generic `200`, create/send reset only if eligible | Enumeration-safe; notification failure not reveal account | reset_requested; Very Strict IP+identifier; spam suppression |
| Reset password | Valid token; token + new password | Hash/compare token, validate password, atomically mark used, update credential, revoke sessions | Invalid/expired/used token, password policy, race/replay | reset_completed/session_revoked; Very Strict |
| Change password | Active JWT; current + new password | Reauthenticate, validate new, update hash, revoke sessions per policy | Wrong current password, reused/weak new password, locked account | password_changed/session_revoked; Strict |
| Verify email | Valid verification token | Validate one-time token, mark verification/account state, return status | Invalid/expired/used/replayed token | email_verified; Very Strict |
| Resend verification | Optional JWT or email proof; email/account context | Generic eligibility check, invalidate/supersede old request as policy, send new token | Enumeration/spam/notification failure | verification_sent; Very Strict IP+identifier |
| Account lock/disable | Administrator + `users:manage`; userId, target status, reason/version | User API validates transition, updates status, revokes sessions transactionally | Self/last-admin/tenant boundary and concurrency rules need User policy; 401/403/404/409 | account_locked/unlocked/session_revoked; default admin limit + idempotency |
| Session revocation | Logout, reset, password/account/role security event | Mark session/token family revoked and deny refresh; access-token handling per revocation design | Partial transaction/replay/cache lag | session_revoked; Strict/admin default by initiator |

## Redirect Outcomes / Kết quả điều hướng

Customer đi intended route hoặc `/customer`; Staff/Manager/Administrator đi `/admin` chỉ sau authorization. Unauthenticated chuyển `/login` kèm safe return path; authenticated thiếu quyền đến trang 403; session expired thử refresh một lần rồi xóa auth state và về login.
