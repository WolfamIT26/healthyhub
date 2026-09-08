# Prompt 35 - Admin Product Catalog Management V1

## Task / Nhiệm vụ

Triển khai Admin Product Catalog Management V1 thật trên canonical Product/Category/Brand/Media persistence và Prompt 34 Admin security foundation. Không tạo authority song song, không mở Inventory adjustment, upload/import/export, Category/Brand CRUD, Review moderation hoặc Prompt 36.

## Result / Kết quả

| Boundary / Ranh giới | Result / Kết quả |
| --- | --- |
| Admin Product Persistence | **READY** |
| Admin Product Read API | **READY** |
| Admin Product Mutation API | **READY** |
| Product Lifecycle Management | **READY** |
| Category/Brand Integration | **READY** |
| Product Media Integration | **READY — existing Media link only** |
| Admin Product Frontend | **READY** |
| Authorization/Security | **PASS** |
| Concurrency | **PASS** |
| Public Catalog Consistency | **PASS** |
| Regression | **PENDING final verification** |

## Implemented / Đã triển khai

- Added typed Admin Product shared contracts for list/detail/options/create/update/status/delete.
- Added `products:read` and `products:manage` permissions to the canonical RBAC seed; no Admin credential was created.
- Added Admin Product controller/service/repository/audit logger using Prompt 34 guards and Product persistence.
- Added `/admin/products`, `/admin/products/new` and `/admin/products/:productId` frontend routes inside the Admin shell.
- Added unit, frontend and MySQL integration coverage for Product admin behavior, security and concurrency.

## Product Authority Reuse / Tái sử dụng authority Product

- Product code remains canonical SKU and is immutable after create.
- Create starts `draft + hidden + unavailable` and does not create an Inventory row.
- Mutations write the same `products`, Product content, nutrition, ingredient, dietary, category link and media link tables that Public Product reads.
- Public visibility requires active Product, public visibility, published Content and active/public primary Category; Inventory remains the availability authority.
- Soft delete targets the Product row only and does not cascade into Order snapshots, Review history, Inventory, Category or Media.

## API / API

- `GET /api/v1/admin/products`: DB pagination, search, status/visibility/category/brand filters and sort whitelist.
- `GET /api/v1/admin/products/options`: Category/Brand/dietary/existing Media lookup for Product form.
- `POST /api/v1/admin/products`: transactional Product aggregate create.
- `GET /api/v1/admin/products/{productId}`: edit/detail aggregate with version and read-only availability.
- `PATCH /api/v1/admin/products/{productId}`: transactional aggregate update with optimistic version.
- `PATCH /api/v1/admin/products/{productId}/status`: lifecycle update with version and public invariants.
- `DELETE /api/v1/admin/products/{productId}`: versioned Product soft-delete.

## Frontend / Frontend

- Admin Products navigation is executable when the actor has Product permissions.
- List page supports server-backed loading/error/retry/empty states, search/filter/sort/pagination and authoritative refetch after mutations.
- Form page supports create/edit, grouped fields for Basic, Brand, Categories, Content, Nutrition, Ingredients, Dietary Tags, Media and Publication.
- SKU is read-only after create; Inventory quantity and Review moderation are not shown as Product controls.

## Security / Bảo mật

- Guest is denied; Customer is forbidden; Internal actor must have active session/account/current persisted role and current Product permission.
- DTO whitelist rejects mass assignment, tenant input, audit input, stock quantity and unsupported fields.
- Category/Brand/Media IDs are validated server-side by tenant/state; frontend role manipulation cannot bypass backend guards.
- Responses avoid Customer PII, provider payload, raw media storage key, secrets and unnecessary audit internals.

## Concurrency / Đồng thời

- Product row locks and version checks protect stale update/status/delete.
- DB unique constraints remain final authority for concurrent SKU/slug conflicts.
- Transaction rollback protects partial relation writes for invalid/cross-tenant relations.
- Delete/update race resolves with exactly one successful mutation.

## Database / Migration

- No schema migration was added.
- Migration state remains expected at **16/16 applied**.
- Seed is idempotent and only adds Product permissions/role assignments.

## Verification / Kiểm tra

- Format check: **PENDING final command**.
- Lint: **PENDING final command**.
- Typecheck: **PENDING final command**.
- Unit tests: **PENDING final command**.
- MySQL integration: **PENDING final command**.
- Migration state: **PENDING final command**.
- Build: **PENDING final command**.
- OpenAPI: **PENDING final command**.
- Secrets/docs/diff checks: **PENDING final command**.

## Remaining Blockers / Blocker còn lại

- Product media attach standalone operation remains blocked by `ADMIN_PRODUCT_MEDIA_ATTACH_USE_AGGREGATE_UPDATE`; aggregate create/update can link existing active Product image Media.
- Product import/export operations remain blocked by `ADMIN_PRODUCT_IMPORT_NOT_IMPLEMENTED` and `ADMIN_PRODUCT_EXPORT_NOT_IMPLEMENTED`.
- Full Category/Brand CRUD and Media upload infrastructure remain future dedicated scopes.

## Not Changed / Không thay đổi

- Không Inventory quantity adjustment, warehouse, supplier, purchase order hoặc stock transfer.
- Không Order/Shipping admin management, refund hoặc Customer/User/Role management UI.
- Không Review moderation, promotions/coupons, analytics nâng cao hoặc AI.
- Không đổi public Product API shape ngoài effect hợp lệ từ Product persistence mutation.
- Không commit, push, merge hoặc bắt đầu Prompt 36.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
