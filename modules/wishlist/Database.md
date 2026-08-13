# Wishlist Database / Cơ sở dữ liệu Wishlist

Migration `1760000009000-enable-wishlist-persistence-v1` tạo:

- `wishlists`: tenant, active CustomerProfile, private/default lifecycle và audit columns.
- `wishlist_items`: Wishlist/Product membership, saved timestamp, active/removed/unavailable lifecycle.

Foreign keys dùng `RESTRICT`. Unique tenant/customer/name bảo vệ một default Wishlist; unique tenant/wishlist/product/status cùng Customer row lock bảo vệ concurrent active add. Remove dùng soft lifecycle và re-add khôi phục cùng membership record.
