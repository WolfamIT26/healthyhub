# Product Requirement / Yêu cầu Product

## Acceptance Criteria / Tiêu chí

- [x] Reuse Product persistence and `ProductCommerceReader`.
- [x] Public-safe list/detail/options, Category and Brand reads.
- [x] Server pagination/search/filter/sort with input whitelist.
- [x] Product/Inventory visibility, price, sellable and availability authority.
- [x] Persisted content, ingredient/allergen, dietary, nutrition and safe public media.
- [x] Catalog/Detail/Search server source of truth with URL reload.
- [x] Cart/Wishlist regression.
- [x] Admin Product list/detail/options over canonical persistence.
- [x] Admin Product create/update/lifecycle/soft-delete with DTO whitelist, transaction and version guard.
- [x] Category/Brand/existing Media relationship assignment without duplicate authority.
- [x] Public Catalog reflects Admin Product mutations while Inventory remains the availability authority.

## Exclusions / Ngoài phạm vi

Inventory quantity adjustment, Media upload infrastructure, import/export jobs, Category/Brand CRUD, Review moderation, Promotion/Coupon, recommendation/AI and Supplier management.
