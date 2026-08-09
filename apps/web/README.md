# Web App / Ứng dụng Web

## Purpose / Mục tiêu

Thư mục này dành cho frontend HealthyHub.

## Planned Stack / Công nghệ dự kiến

- React.
- Vite.
- TypeScript.
- Tailwind CSS.

## Current Status / Trạng thái hiện tại

Đã có React/Vite foundation, Authentication Frontend V1, Shared UI Foundation, Homepage V1 và Product Catalog V1.

Foundation hiện có:

- App shell trong `src/app`.
- Route foundation trong `src/routes`.
- Public, customer và admin layout trong `src/shared/layouts`.
- Error boundary, loading, empty state và toast trong `src/components/foundation`.
- Axios client và API error normalization trong `src/services/api`.
- Tailwind global style trong `src/styles`.
- Authentication forms tại `src/pages/auth`, session/context tại `src/features/auth`.
- Homepage storefront tại `src/pages/HomePage.tsx`, typed presentation data tại `src/features/home/homepage.data.ts` và public navigation/footer responsive.
- Product Catalog presentation tại `/products`: typed shared model, URL-synced search/filter/sort/pagination, responsive filter Drawer và đầy đủ loading/empty/error state.
- Route foundation `/products/:slug`, `/promotions`, `/blog` và `/ai` hiển thị trạng thái đang phát triển; chưa có Product Detail/Cart/AI business logic.
- Access token chỉ giữ trong memory; refresh dùng HttpOnly cookie + CSRF, không dùng Web Storage.
- Guest/customer/admin guards và 49 frontend tests.

Tài liệu vận hành nằm tại `docs/implementation-foundation/README.md`.
