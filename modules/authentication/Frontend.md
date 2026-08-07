# Frontend Mapping / Ánh xạ frontend Authentication V1

## Forms / Form

Login, register and forgot use email only; phone/username are not login identifiers. New password is 12–128 Unicode characters without composition rule; confirm password is client-only. Registration always enters email-verification state. Forgot/resend show the same accepted state regardless of account existence; login shows one generic account/credential message.

## Token & Session Handling / Xử lý token và phiên

- Access token lives in memory only. Refresh token is never readable by JavaScript and is delivered by `__Host-hh_refresh` HttpOnly/Secure/SameSite=Lax cookie.
- Axios uses credentialed requests only to exact configured API origins. Web refresh adds signed double-submit `X-CSRF-Token`; no localStorage/sessionStorage tokens.
- Bootstrap has unknown/authenticated/unauthenticated states. A single coordinated refresh handles concurrent 401s; failure clears auth state and redirects to login with safe same-origin return path.
- 403 preserves session and renders Vietnamese forbidden state. Session-expired never loops. Token responses are not cached.
- Login/refresh rotates cookie; logout/reset clears it; change password revokes other sessions and rotates current.

## Routes & Accessibility / Route và accessibility

Existing `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password`; account-security path remains a frontend routing choice but uses the fixed change-password API. Customer/admin redirects require backend-returned effective authorization. All forms retain label/error-summary/focus/loading/mobile one-column requirements and never display secret/internal account state.

UI Contracts for login/register/forgot-reset have been updated and contain no unresolved session-handling blocker.

## Prompt 18 Implementation — 2026-08-07

- Implemented `/login`, `/register`, `/forgot-password`, `/reset-password` and `/verify-email` with Vietnamese validation, loading, safe errors and accessible labels.
- Added in-memory access-token/session store, session restore, logout, customer/admin protected routes, guest-only routes and role/permission helpers.
- Axios sends credentials and `X-Client-Platform: web`; refresh mirrors signed `hh_csrf` cookie into `X-CSRF-Token`, coordinates one refresh promise and retries a protected request at most once.
- Refresh token is never read or persisted by JavaScript. No token/password logging and no secret/VITE secret were added.

## Prompt 18.1 Visual Asset Integration — 2026-08-07

Authentication pages đã dùng các asset HealthyHub hiện hữu: login/register/Hero banner, Logo Symbol và loading/success/maintenance illustrations. Desktop dùng split layout, mobile giữ form một cột; ảnh trạng thái và banner được lazy-load. Không thay logic, API, route hoặc backend.
