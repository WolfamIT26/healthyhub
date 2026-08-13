# Wishlist API / API Wishlist

| Method | URI | Result |
| --- | --- | --- |
| GET | `/api/v1/me/wishlist` | Typed paginated owner list |
| POST | `/api/v1/me/wishlist/items` | Add/return existing Product item |
| DELETE | `/api/v1/me/wishlist/items/{wishlistItemId}` | Remove owned item |
| DELETE | `/api/v1/me/wishlist/products/{productId}` | Idempotent remove by Product |

All operations require Customer JWT. GET supports only `page` and `pageSize` (1–60). Add accepts only `{ productId }`. Responses omit customer/wishlist/audit fields and use current Product/Inventory read data.
