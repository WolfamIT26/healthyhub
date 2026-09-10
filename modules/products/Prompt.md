# Product Prompt / Prompt module Product

Before changing Product, read project rules, Product/Category/Brand/Inventory contracts and Cart/Wishlist/Search consumers. Keep public responses minimal, derive availability from Inventory and never let client-supplied price/stock/sellable state become authority.

Prompt 35 adds Admin Product management on top of the same authority. Reuse Prompt 34 Admin auth, require current Internal role plus `products:read` or `products:manage`, whitelist DTOs, use transactions/version checks and keep Inventory quantity, Media upload, Category/Brand CRUD, Review moderation and Prompt 36 out of scope.
