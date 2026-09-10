# Product Report / Báo cáo Product

## Prompt 35 Result / Kết quả Prompt 35

Admin Product Catalog Management V1 is executable from the canonical Product persistence. Internal users with `products:read` can read list/detail/options; users with `products:manage` can create, update, change lifecycle and soft-delete Products.

Mutations write the same Product/Category/Brand/Content/Nutrition/Ingredient/Dietary/Media-link tables consumed by the public catalog. Create starts draft/hidden/unavailable, update keeps SKU immutable, lifecycle changes enforce active/public/content/category invariants, and soft delete removes the Product from public reads without cascading historical Order/Review/Inventory data.

Inventory quantity adjustment, Media upload, import/export, Category/Brand CRUD and Review moderation remain outside Prompt 35.

## Prompt 31 Result / Kết quả Prompt 31

Product Persistence and Public API are executable from MySQL. Public list/detail resolve Product, primary Category, Brand, published Content, dietary/nutrition/ingredient data and safe public media; sellable/availability uses the existing Inventory authority.

Catalog and Product Detail now fetch server state on mount/reload. Search discovery uses debounced/cancellable keyword requests and server options. Frontend fixtures no longer control these production paths. Cart and Wishlist keep the same shared actions with authoritative Product IDs.

Security boundaries reject unknown query values, hide inactive/non-public Products, omit internal cost/supplier/audit/stock quantity/raw storage data and do not add mutations.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
