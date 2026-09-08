# Product Backend / Backend Product

`ProductModule` exposes public controllers backed by `TypeOrmPublicProductRepository` and `ProductService`. Queries join persisted Product, primary Category, optional Brand/published Content and Inventory, then batch-load dietary tags, ingredients, nutrition and safe public media.

Validation uses DTO whitelist for page/pageSize, q, category, brand, dietary, price range, availability and sort. Invalid price range/identifier is 400; hidden, inactive, deleted or missing Product is 404. No public operation accepts cost, stock, price or lifecycle commands.

`ProductCommerceReader` remains unchanged as the Cart/Wishlist/Checkout commerce boundary.

Prompt 35 adds `AdminProductController`, `AdminProductService` and `TypeOrmAdminProductRepository`. Admin mutations run in transactions, lock the Product row for update/status/delete, check optimistic `version`, and rely on DB unique constraints for final SKU/slug concurrency authority. Create always starts as `draft`, `hidden` and `unavailable`; it does not create an Inventory row.

Relationship writes replace the approved Product aggregate only: Brand, Category links with exactly one active primary Category, content, nutrition, ingredients, dietary tags and links to existing active Product image Media. Public visibility is only allowed when the Product is active, has published content and has an active/public primary Category. Inventory availability is read-only and is never bypassed by Product lifecycle.

Privileged mutations emit safe structured audit logs through the existing application logger. No second audit store or Product authority is introduced.
