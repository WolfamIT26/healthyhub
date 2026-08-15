# HealthyHub Product Catalog V1

## Phạm vi

Route `/products` giữ UX Prompt 21 nhưng source of truth production là `GET /api/v1/public/products`. `catalog.data.ts` chỉ còn dùng cho isolated tests và Homepage foundation; Catalog runtime không import dữ liệu đó.

## Authority và contract

- Product identity, name, slug, price, visibility và sellable state lấy từ Product persistence.
- Category/Brand/dietary options lấy từ `GET /api/v1/public/products/options`.
- Availability lấy từ Inventory persistence; frontend không tự quyết định stock/sellable.
- Server xử lý search, filter, sort và pagination. Public chỉ thấy Product active/public có primary Category active/public.
- Response không chứa internal cost, supplier, audit hoặc inventory quantity.

## URL query

Catalog đồng bộ URL với `search`, `category`, `brand`, `dietary`, `minPrice`, `maxPrice`, `availability`, `sort`, `page`, `limit`. Adapter đổi `search → q` và `limit → pageSize` khi gọi API. Approved sort gồm featured, newest, name và price; rating/best-selling không được giả lập khi chưa có Review/sales authority.

Reload, copy URL và browser navigation gọi lại server với cùng query. Filter/search/sort reset page; pagination giữ filter hiện tại.

## UX và accessibility

Desktop dùng sidebar; mobile/tablet dùng Drawer. Loading skeleton, API error/retry, filtered empty, product grid và pagination vẫn dùng Design System. Stock có text; action Add to Cart chỉ enabled theo `sellable`; Wishlist dùng shared server-backed feature.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
