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
| GET | `/api/v1/admin/products` | Admin Product list with DB pagination/search/filter/sort. |
| GET | `/api/v1/admin/products/options` | Admin Product form lookups for Category, Brand, dietary tags and existing Product image Media. |
| POST | `/api/v1/admin/products` | Create Product aggregate as draft/hidden/unavailable. |
| GET | `/api/v1/admin/products/{productId}` | Admin Product detail/edit aggregate. |
| PATCH | `/api/v1/admin/products/{productId}` | Update editable Product aggregate with version guard. |
| PATCH | `/api/v1/admin/products/{productId}/status` | Change canonical Product status/visibility/sellable state with version guard. |
| DELETE | `/api/v1/admin/products/{productId}` | Soft-delete Product with version guard. |

Product list supports page 1+, pageSize 1–60, q, category/brand ID or slug, dietary all-match, price range, Inventory availability and approved sort. Responses omit cost, supplier, audit, raw media storage and Inventory quantity.

Admin Product read requires current Internal role and `products:read`; create/update/status/delete require `products:manage`. Admin APIs do not accept tenant, customer, stock quantity, raw media URL or arbitrary relation authority from clients.
