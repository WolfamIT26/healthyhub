# Product ChangeLog / Nhật ký Product

## 2026-08-21 — Prompt 32

- Reused the Inventory evaluator for public availability so zero quantity cannot render in-stock.
- Kept public Product responses free of internal Inventory quantity.

## 2026-08-13 — Prompt 31

- Added Product/Category/Brand/content/dietary/nutrition/media public-read persistence and migrations.
- Added typed public Product, Category and Brand APIs with server query validation.
- Switched Catalog, Detail and Search production paths to Product API.
- Preserved ProductCommerceReader and Cart/Wishlist behavior.
- Kept Admin CRUD, upload, Inventory mutation, Review, Promotion and AI out of scope.
