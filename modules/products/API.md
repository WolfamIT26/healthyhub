# Product API / API Product

| Method | URI | Purpose |
| --- | --- | --- |
| GET | `/api/v1/public/products` | Public Product page with server query. |
| GET | `/api/v1/public/products/{productId}` | Public detail by numeric ID or slug. |
| GET | `/api/v1/public/products/options` | Category/Brand/dietary discovery options. |
| GET | `/api/v1/public/categories` | Public Category page. |
| GET | `/api/v1/public/categories/tree` | Public Category tree. |
| GET | `/api/v1/public/categories/{categoryId}` | Public Category detail. |
| GET | `/api/v1/public/brands` | Public Brand page. |
| GET | `/api/v1/public/brands/{brandId}` | Public Brand detail. |

Product list supports page 1+, pageSize 1–60, q, category/brand ID or slug, dietary all-match, price range, Inventory availability and approved sort. Responses omit cost, supplier, audit, raw media storage and Inventory quantity.
