# HealthyHub Product Catalog V1

## Phạm vi

Route `/products` cung cấp Catalog presentation chạy hoàn toàn ở frontend. Product backend, Cart, Wishlist persistence/API runtime, Review API và AI Search runtime chưa được triển khai.

## Product model và dữ liệu

- Model dùng chung: `apps/web/src/features/products/product.types.ts`.
- Dữ liệu presentation tập trung: `apps/web/src/features/products/catalog.data.ts`.
- Featured Products trên Homepage dùng cùng nguồn/model với Catalog.
- `thumbnail`/`images` đã có trong model để thay bằng media public sau này; V1 dùng visual fallback khi chưa có Product Media API.

## URL query

Catalog đồng bộ state với URL bằng các query:

- `search`, `category`, `brand`, `dietary`
- `minPrice`, `maxPrice`, `availability`
- `sort`, `page`, `limit`

Parser cũng đọc `q` và `categoryId` từ link cũ; URL mới luôn được chuẩn hóa về `search` và `category`. Search/filter/sort/page thay đổi qua React Router nên reload, copy URL và browser history giữ đúng state.

## UX

- Desktop: filter sidebar và product grid.
- Mobile/tablet: nút mở Drawer, có số filter active, Apply và Clear all.
- Search submit bằng Enter, trim/giới hạn 100 ký tự và có nút clear.
- Pagination mặc định 20, hỗ trợ 12/20/40/60 và reset page khi query thay đổi.
- Có Product Skeleton, EmptyState, ErrorState + Retry và success grid.
- CTA chỉ mở route Product Detail foundation; không thêm vào giỏ hay giả lập mua thành công.

## Accessibility và responsive

- Một H1, Breadcrumb, section heading semantic, label riêng cho mọi control.
- Drawer có dialog semantics/Escape; product CTA, chips và pagination dùng keyboard/focus-visible.
- Grid: 1 cột mobile, 2 cột tablet/laptop, 3 cột trong vùng kết quả desktop rộng.
- Stock status có text, không truyền đạt chỉ bằng màu.

## Thay bằng API sau này

Giữ `ProductPresentationModel`, thay `catalogProducts` bằng adapter từ `GET /api/v1/public/products` và options public. Trạng thái `loading/error/success` đã có sẵn trong page để nối data source mà không đổi UI contract.
