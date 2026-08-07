# Frontend Mapping / Ánh xạ frontend Authentication V1

## Forms / Form

Login, register and forgot use email only; phone/username are not login identifiers. New password is 12–128 Unicode characters without composition rule; confirm password is client-only. Registration enters an unverified Customer state but no longer blocks Customer login. Forgot remains generic except the product-required unverified-account guidance; invalid credentials remain generic.

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

## Prompt 18.1 Unified Authentication Visual Design — 2026-08-07

Tất cả trang và trạng thái Authentication độc lập dùng duy nhất `assets/banners/Authentication Banner.png` làm nền `cover`. Form được đặt trong card sáng bán trong suốt rộng tối đa 460px ở vị trí center-left trên tablet/desktop và căn giữa trên mobile; mascot cùng key visual bên phải được giữ thoáng. Logo Symbol và chữ HealthyHub lớn hơn được đặt trong card; loading/success/maintenance illustrations chỉ xuất hiện cho trạng thái tương ứng. Không thay logic, API, route hoặc backend.

## Prompt 18.2 Centered Card & Responsive Banner — 2026-08-07

Card Authentication được căn giữa thật theo cả hai trục bằng flex ở mọi breakpoint. Hero tự chiếm phần viewport còn lại sau header nhờ flex-column layout, không hardcode header height; form dài làm hero/page tăng chiều cao và vẫn scroll tự nhiên. Banner chuyển sang `object-fit: contain` trên nền gradient đồng màu để giữ trọn artwork và đúng tỷ lệ. Card có animated green conic-gradient glow 5 giây, tự chuyển thành viền xanh tĩnh khi `prefers-reduced-motion: reduce`.

## Prompt 18.3 Password UX & Policy — 2026-08-07

Login, Register password/confirmation và Reset password/confirmation dùng chung `PasswordField`: mặc định ẩn, nút icon hiện/ẩn có `aria-label`, `aria-pressed`, hỗ trợ bàn phím và giữ focus/value khi click. Frontend chưa có Change Password screen nên không thêm route ngoài scope.

Frontend giữ policy 12–128 ký tự/no-composition và bổ sung thông báo tiếng Việt cho mật khẩu phổ biến hoặc chứa email, local-part, domain/domain label không phân biệt hoa thường. Register kiểm tra theo email đang nhập; Reset không biết email từ token nên frontend kiểm tra length/common, backend enforce đầy đủ theo account.

## Prompt 18.6 Customer vs Internal Email Verification — 2026-08-07

Authenticated Customer có `actor.isEmailVerified=false` vẫn vào Customer area. `EmailVerificationBanner` sticky hiển thị cảnh báo, link xác minh, resend và nút đóng tạm; state đóng không persist nên banner xuất hiện lại sau reload/remount. Development build hiển thị ghi chú Local Mail/Development Tools, production build loại bỏ qua `import.meta.env.DEV`.

`/verify-email` cho phép cả guest và authenticated Customer truy cập. Forgot Password khi backend trả `AUTH.EMAIL_NOT_VERIFIED` hiển thị hướng dẫn cụ thể cùng link gửi lại email, không redirect Login. Checkout/Payment/Change Password modal chưa được tạo vì các màn/action đó chưa tồn tại trong frontend hiện tại.
