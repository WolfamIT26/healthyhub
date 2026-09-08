# Product Status / Trạng thái Product

`Product Persistence, Public API and Admin Product Management V1 implemented.`

Catalog, Detail and keyword Search use server Product authority. Inventory supplies availability; Cart/Wishlist continue to use Product IDs and server validation.

Prompt 33.2 makes Review/rating Product Detail integration **READY** through separate authoritative Review list/summary APIs. Product response shape remains unchanged and no fixture rating is used.

Prompt 35 makes Admin Product list/detail/create/update/lifecycle/soft-delete **READY** using the same Product/Category/Brand/Media persistence. Inventory remains read-only for Product management; upload/import/export jobs remain blocked.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
