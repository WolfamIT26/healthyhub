# Cart Module Report

## Status

**COMPLETE — Cart Persistence: Server-side implemented.**

## Implementation

- MySQL `carts` và `cart_items` với Customer/Product FK, active Cart/active item uniqueness, quantity checks, audit/version fields và reverse rollback.
- Customer-only API: `GET /api/v1/cart`, `POST /api/v1/cart/items`, `PATCH /api/v1/cart/items/{cartItemId}`, `DELETE /api/v1/cart/items/{cartItemId}`.
- Transactional create/add/merge/update/remove; CustomerProfile lock và persistence unique constraints chống double Add.
- Read model lấy name/slug/current price từ Product và availability từ Inventory; subtotal server-authoritative.
- React CartProvider fetch/mutate/refetch từ API, clear theo logout/account key và không dùng browser storage.

## Acceptance evidence

| Requirement | Result |
| --- | --- |
| Reload/login cùng Customer giữ Cart | **PASS** — MySQL integration reload service và frontend remount refetch |
| Customer B không thấy Cart A | **PASS** |
| Duplicate/rapid Add không tạo duplicate | **PASS** — one CartItem row, merged quantity |
| Authoritative price/availability | **PASS** |
| Unverified Customer Cart | **PASS** |
| Checkout verification gate | **PASS** |

## Explicitly deferred

Guest Cart token/merge, coupon, validate action, Checkout, inventory reservation/mutation, Order, Payment và Wishlist persistence.

Chi tiết: [Cart documentation](../../docs/cart.md).
