# Product ChangeLog / Nhật ký Product

## 2026-08-21 — Prompt 33.2

- Replaced Product Detail no-data Review placeholder with persisted rating summary/list and owner form.
- Kept Product public API shape unchanged; Review endpoints own aggregate and verified evidence.

## 2026-08-21 — Prompt 33.1

- Updated Product Detail Review blocker: eligibility is READY; persistence/API/aggregate remain missing.

## 2026-08-21 — Prompt 33

- Audited Review/rating authority for Product Detail.
- Kept the no-fake Review placeholder because verified-purchase eligibility is runtime-blocked.
- Added no Product rating field or frontend aggregate without persisted Review authority.

## 2026-08-21 — Prompt 32

- Reused the Inventory evaluator for public availability so zero quantity cannot render in-stock.
- Kept public Product responses free of internal Inventory quantity.

## 2026-08-13 — Prompt 31

- Added Product/Category/Brand/content/dietary/nutrition/media public-read persistence and migrations.
- Added typed public Product, Category and Brand APIs with server query validation.
- Switched Catalog, Detail and Search production paths to Product API.
- Preserved ProductCommerceReader and Cart/Wishlist behavior.
- Kept Admin CRUD, upload, Inventory mutation, Review, Promotion and AI out of scope.
