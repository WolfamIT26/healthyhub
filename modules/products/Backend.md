# Product Backend / Backend Product

`ProductModule` exposes public controllers backed by `TypeOrmPublicProductRepository` and `ProductService`. Queries join persisted Product, primary Category, optional Brand/published Content and Inventory, then batch-load dietary tags, ingredients, nutrition and safe public media.

Validation uses DTO whitelist for page/pageSize, q, category, brand, dietary, price range, availability and sort. Invalid price range/identifier is 400; hidden, inactive, deleted or missing Product is 404. No public operation accepts cost, stock, price or lifecycle commands.

`ProductCommerceReader` remains unchanged as the Cart/Wishlist/Checkout commerce boundary.
