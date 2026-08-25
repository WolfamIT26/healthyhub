# Database ChangeLog / Nhật ký thay đổi Logical Database Design

## 2026-08-21 — Prompt 33.2

- Made `product_reviews` executable with required Order identity and active/published aggregate semantics.
- Kept moderation/report entities future design-only.

## 2026-08-21 — Prompt 33.1

- Aligned canonical fulfillment states/histories and future Review Order+Product identity.

## [0.5.0] - 2026-08-21

- Marked Review persistence design-only for Prompt 33; no migration was created.
- Deferred verified-purchase evidence, exact duplicate identity and status lifecycle until Order completion eligibility is canonical.

## [0.4.0] - 2026-08-21

- Made Order-scoped `stock_reservations` executable for Prompt 32.1.
- Canonical identity is unique `(tenant_id, order_id, inventory_item_id)`; states are active/consumed/released/restocked.
- Kept adjustments/alerts design-only and omitted an independent reservation expiry authority.

## [0.3.0] - 2026-08-21

- Confirmed `inventory_items` as the only executable Inventory persistence in Prompt 32; adjustment/reservation tables remain design-only pending lifecycle decisions.

## [0.2.0] - 2026-08-13

- Added executable Product dietary/nutrition and featured-state clarification for Prompt 31 while preserving Product/Category/Brand ownership.

## [0.1.0] - 2026-08-06

### Added / Đã thêm

- Tạo Logical Database Design cho HealthyHub tại `.spec/database`.
- Tạo Database Standards, Domain Data Map, Cross Domain Relationships, Logical ERD và Data Readiness.
- Tạo 23 tài liệu logical database riêng trong `.spec/database/domains`.
- Tạo data dictionary riêng trong từng domain database file.
- Tạo Status, Report, Checklist và ChangeLog cho Logical Database Design.

### Notes / Ghi chú

- Phạm vi chỉ là logical database documentation.
- Không viết SQL, migration, ORM model hoặc code.
