# HealthyHub Wishlist Persistence V1

## Runtime status

**Wishlist Persistence: READY. Wishlist API: READY.**

Prompt 30 chuyển Wishlist Prompt 24 từ React memory sang MySQL source of truth, giữ nguyên `/wishlist`, `WishlistButton`, guest login prompt, empty/out-of-stock UI, dynamic `aria-label` và `aria-pressed`.

## Backend

- `GET /api/v1/me/wishlist?page=1&pageSize=20` đọc owner-scoped Wishlist.
- `POST /api/v1/me/wishlist/items` add public Product bằng typed `{ productId }`.
- DELETE theo Wishlist item hoặc Product; remove theo Product idempotent.
- Owner derive từ JWT → active CustomerProfile; Guest bị Authentication guard chặn, Internal bị Customer role/owner policy chặn.
- Một default private Wishlist được lazy-create. Customer lock và DB unique constraint ngăn duplicate do double-click/concurrency.
- Membership persist; Product/Inventory cung cấp current price/availability. Product hết hàng vẫn được lưu; item không còn public trả `UNAVAILABLE`.

## Frontend synchronization

- `WishlistContext` initial-fetch từ API và refetch authoritative state sau add/remove.
- Reload/remount và login lại cùng Customer phục hồi Wishlist từ server.
- Logout/đổi account remount provider theo actor để không leak state; logout không gọi delete server.
- Không dùng `localStorage` hoặc `sessionStorage`.
- Product Catalog, Product Detail và Wishlist page tiếp tục dùng cùng Wishlist feature layer.

## Scope boundary

Không triển khai sharing/public Wishlist, price notification, recommendation, Product/Cart mutation mới hoặc AI.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
