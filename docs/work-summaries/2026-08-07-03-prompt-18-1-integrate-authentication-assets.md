# Prompt 18.1 — Integrate Existing HealthyHub Assets

## Mục tiêu

Nâng cấp riêng visual layer của Authentication Frontend V1 bằng các asset đã có trong repository. Không thay đổi authentication logic, API call, route, backend, policy hoặc OpenAPI.

## Asset đã tích hợp

| Màn hình/trạng thái | Asset |
| --- | --- |
| Login | `assets/banners/login-banner.png` |
| Register | `assets/banners/register-banner.png` |
| Forgot Password | `assets/banners/Hero Illustration.png` |
| Auth branding | `assets/logos/Logo Symbol.png` |
| Loading/verification | `assets/illustrations/loading.png` |
| Register/reset/verify success | `assets/illustrations/success.png` |
| Invalid/expired token | `assets/illustrations/maintenance.png` |

Các asset khác trong danh sách Prompt 18.1 không được chèn khi không phù hợp ngữ cảnh Authentication, tránh trang bị dư hình ảnh hoặc sai mục đích.

## Thay đổi giao diện

- Auth card dùng layout split-screen trên desktop và form một cột trên mobile.
- Login/Register/Forgot/Reset có visual panel phù hợp với từng flow.
- Loading, success và invalid-token state sử dụng illustration thay cho trạng thái chỉ có text.
- Logo Symbol được đưa vào brand link của Authentication card.
- Banner và state illustration dùng lazy loading.
- Giữ label, alt text, keyboard navigation, responsive behavior và Tailwind styling.

## Phạm vi giữ nguyên

- Không thay Authentication state/session/refresh logic.
- Không sửa API client hoặc endpoint call.
- Không sửa routing.
- Không chạm backend/database/migration.
- Không thêm, tạo hoặc đổi tên asset.

## Verification

- Frontend lint: pass.
- Frontend typecheck: pass.
- Frontend tests: 6 files / 18 tests pass.
- `npm run build:web`: pass.
- `git diff --check`: pass.

## Kết quả

Authentication Frontend giữ nguyên hành vi Prompt 18, đồng thời sử dụng đúng bộ nhận diện và illustration HealthyHub hiện có với layout responsive.
