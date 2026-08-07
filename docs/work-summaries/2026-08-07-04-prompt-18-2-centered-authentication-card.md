# Prompt 18.2 — Centered Authentication Card + Animated Green Glow + Responsive Banner

## Kết quả

Authentication card hiện nằm chính giữa theo cả chiều ngang và chiều dọc trên desktop, laptop, tablet và mobile. Thay đổi chỉ thuộc visual/layout; Authentication logic, API, validation, routing, session/refresh, backend và asset không đổi.

## Visual implementation

- Hero dùng flex centering thật, không dùng margin/padding để giả lập vị trí.
- Public layout dùng flex-column; hero tự chiếm phần viewport còn lại sau header mà không hardcode header height.
- Card responsive rộng tối đa 460px, mobile rộng `100vw - 2rem`, radius 26px, nền trắng bán trong suốt, blur và shadow nhẹ.
- Card có conic-gradient glow xanh chạy liên tục 5 giây phía sau nội dung.
- `prefers-reduced-motion: reduce` tắt animation và giữ viền xanh tĩnh.
- Banner dùng `object-fit: contain` và `object-position: center`, giữ nguyên aspect ratio và toàn bộ artwork.
- Gradient xanh kem đồng palette nằm sau banner để xử lý khoảng trống khi tỷ lệ viewport khác tỷ lệ ảnh.
- Form dài làm page tăng chiều cao và scroll tự nhiên.

## Direct route verification

- `/login`: desktop 1440px.
- `/reset-password`: laptop 1024px.
- `/register`: tablet 820px.
- `/forgot-password`: mobile screenshot 390px.
- `/verify-email`: tablet 820px.

Chrome headless macOS giữ minimum layout viewport lớn hơn chiều rộng file screenshot 390px; quy tắc mobile được kiểm tra thêm từ CSS build: card dùng `calc(100vw - 2rem)`, input dùng `width: 100%`, navigation wrap và hero không overflow.

## Scope integrity

- Không sửa Authentication service/state hoặc token/session/CSRF/cookie handling.
- Không sửa API client, interceptor, request/response contract hoặc validation.
- Không sửa backend, database, migration hoặc OpenAPI.
- Không sửa route guard, route/link/menu hoặc asset binary.

## Verification

- Frontend lint: pass.
- Frontend typecheck: pass.
- Frontend tests: blocked before collection by the existing jsdom ESM dependency conflict on Node 18; no Authentication assertion failed.
- `npm run build:web`: pass.
- `git diff --check`: pass.
