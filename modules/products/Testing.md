# Product Testing / Kiểm thử Product

Coverage includes DTO rejection, list pagination/search/category/brand/dietary/price/availability/sort, hidden Product, detail/not-found, nutrition/ingredient/allergen/media mapping, Category/Brand reads and migration constraints.

MySQL integration creates isolated Product authority records and proves stable pagination, all-tag filtering, price sort, ingredient search, Inventory availability, hidden exclusion and persisted detail data. Frontend tests cover API adapter, Catalog query, Detail load, autocomplete debounce/API call and Cart/Wishlist regressions.

Prompt 35 adds backend coverage for Admin list/detail/options/create/update/status/delete, DTO whitelist, duplicate SKU/slug, invalid and cross-tenant relations, primary Category invariant, stale version, public visibility invariants, safe authorization and audit metadata. MySQL integration covers transactional aggregate writes, no Inventory row on create, public catalog reflection, uniqueness races, rollback and delete/update races.

Frontend coverage adds Admin Products navigation, list states, search/filter/pagination, lifecycle/delete refresh, create/edit form payloads, validation/server errors and missing-manage-permission behavior.
