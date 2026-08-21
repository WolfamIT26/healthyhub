# Database ChangeLog / Nhật ký thay đổi Logical Database Design

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
