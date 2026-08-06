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
