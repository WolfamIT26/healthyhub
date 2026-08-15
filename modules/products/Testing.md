# Product Testing / Kiểm thử Product

Coverage includes DTO rejection, list pagination/search/category/brand/dietary/price/availability/sort, hidden Product, detail/not-found, nutrition/ingredient/allergen/media mapping, Category/Brand reads and migration constraints.

MySQL integration creates isolated Product authority records and proves stable pagination, all-tag filtering, price sort, ingredient search, Inventory availability, hidden exclusion and persisted detail data. Frontend tests cover API adapter, Catalog query, Detail load, autocomplete debounce/API call and Cart/Wishlist regressions.
