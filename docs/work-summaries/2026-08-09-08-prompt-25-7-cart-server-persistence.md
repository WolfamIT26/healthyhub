# Work Summary — Prompt 25.7 Cart Server Persistence

**Status:** Complete — Cart Persistence: Server-side implemented

## Summary

- Tạo Cart/CartItem migration, entities và transactional repository.
- Triển khai Customer-only Cart API và Cart-specific OpenAPI schemas.
- Response dùng Product price/sellable và Inventory availability authority; không tin client derived values.
- Chuyển Cart frontend từ memory-only sang API fetch/add/update/remove với server response sync.
- Thêm development Product/Inventory seed idempotent để Catalog IDs có authority thật.

## Verification evidence

- API unit: 14 files, 68 tests pass.
- MySQL integration: 3 files, 6 tests pass; Customer A reload/login persistence, Customer B isolation, double Add merge, rows thật và cleanup.
- Frontend: 15 files, 94 tests pass, gồm initial load/error, mutation, remount refetch, Header/Checkout regressions.
- Migration run/show, seed hai lần, OpenAPI validation, lint/typecheck/build/secrets/diff checks được ghi trong final verification.

## Not changed

Không triển khai Checkout, Shipping, Payment, Coupon, Order, Inventory reservation/mutation, Product Admin CRUD, Wishlist persistence, Review hoặc AI.
