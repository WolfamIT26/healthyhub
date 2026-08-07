# Prompt 18.1 — Unified Authentication Visual Design

## Kết quả

Authentication frontend đã được thống nhất thành một visual identity duy nhất. `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email` và các trạng thái Authentication liên quan đều dùng `assets/banners/Authentication Banner.png` làm background toàn vùng, với form/state đặt trong card sáng bán trong suốt.

## Thay đổi visual

- Bỏ layout split FORM | IMAGE và thay bằng background `cover` responsive.
- Card rộng tối đa 460px, bo góc lớn, shadow mềm và blur nhẹ; căn center-left từ tablet/desktop, căn giữa trên mobile.
- Giữ vùng mascot/key visual bên phải thoáng trên màn hình lớn.
- Đưa `Logo Symbol.png` và HealthyHub wordmark lớn hơn vào card.
- Giữ `loading.png`, `success.png`, `maintenance.png` cho trạng thái phù hợp và lazy-load các illustration này.
- Cho public navigation wrap trên mobile để tránh tràn ngang mà không đổi link hoặc routing.

## Asset cleanup

Các import `login-banner.png`, `register-banner.png` và `Hero Illustration.png` đã được gỡ khỏi Authentication frontend. Không asset nào bị thêm, xóa, đổi tên hoặc chỉnh sửa nội dung.

## Phạm vi giữ nguyên

- Authentication logic và session/refresh behavior.
- API client, endpoint calls và routing.
- Backend, database, migration, policy và OpenAPI.
- Form validation, labels, keyboard access và safe error handling.

## Responsive verification

- Desktop: `/login` tại 1440px.
- Tablet: `/register` tại 820px.
- Mobile: `/forgot-password` tại 390px.
- Related states: `/reset-password` và `/verify-email` tại 1024px.

Các route trực tiếp đều render background thống nhất, card không che mascot/key visual và form/state vẫn đọc được ở breakpoint tương ứng.

## Verification

- Frontend lint: pass.
- Frontend typecheck: pass.
- Frontend tests: blocked before collection by the installed jsdom dependency chain on Node 18 (`html-encoding-sniffer` CommonJS → ESM-only `@exodus/bytes`); 0 tests loaded. The same 6 files / 18 tests passed in the preceding Prompt 18 verification.
- `npm run build:web`: pass.
- Full `npm run build`: pass.
- `git diff --check`: pass.
