# UI Contract ChangeLog / Nhật ký thay đổi UI Contract

## 2026-08-21 — Prompt 33.2

- Opened Product Detail Review summary/list/pagination and Customer create/edit/delete states.
- Added Guest CTA, safe ineligible reason and returned verified-badge revocation behavior.

## 2026-08-21 — Prompt 33.1

- Added canonical fulfillment labels and kept Review UI blocked by missing runtime API/persistence.

## [0.3.0] - 2026-08-21

- Marked Product Detail Review data and Customer Reviews screen runtime-blocked for Prompt 33.
- Required the current Product Detail no-fake placeholder until backend eligibility becomes executable.

## [0.2.0] - 2026-08-06

### Changed / Đã thay đổi

- Chốt email-only login, password 12–128 ký tự và bắt buộc email verification cho Authentication V1.
- Chốt Web access token in-memory, refresh cookie HttpOnly + CSRF, coordinated refresh, generic auth errors và reset xóa session/cookie.

## [0.1.0] - 2026-08-06

### Added / Đã thêm

- Tạo UI Contract Specification tại `.spec/ui-contract`.
- Tạo UI Contract Index, UI Contract Standards, Navigation, Screen Flow, Component Mapping và State Contract.
- Tạo Screen Index tại `.spec/ui-contract/screens/README.md`.
- Tạo 32 screen contract cho Public, Authentication, Customer và Admin/Staff.
- Chuẩn hóa route, permission, required API, required data, UI sections, components, form, validation, search, filter, sort, pagination, upload, download và UI states cho từng màn hình.
- Chuẩn hóa loading, empty, error, success, confirmation dialog, toast, skeleton, responsive behavior, accessibility và SEO metadata rule.

### Notes / Ghi chú

- Không thiết kế giao diện đẹp.
- Không tạo Figma hoặc wireframe hình ảnh.
- Không viết React, HTML, CSS, JavaScript hoặc TypeScript.
- Bộ tài liệu này là đầu vào cho Design System và Frontend Development.
