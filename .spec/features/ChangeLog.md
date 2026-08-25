# Feature Specifications ChangeLog / Nhật ký thay đổi đặc tả tính năng

## 2026-08-25 — Prompt 34

- Marked Admin Dashboard V1 executable with Product/Inventory/Order/Review aggregates.
- Kept financial analytics, Admin CRUD and Review moderation outside executable scope.

## 2026-08-21 — Prompt 33.2

- Marked Review public/customer V1 executable from persisted completed+delivered evidence.
- Added owner create/edit/delete, aggregate and Product Detail behavior; kept Admin moderation outside scope.

## 2026-08-21 — Prompt 33.1

- Canonicalized executable Order/Shipping fulfillment and Review eligibility.

## 2026-08-21 / Prompt 33

- Audited Review purchase eligibility against executable Customer/Order/Payment/Inventory boundaries.
- Marked Review V1 BLOCKED because no authoritative completed/delivered transition exists for COD and VNPAY.
- Rejected Cart/Wishlist/OrderPlaced/paid/confirmed/stock-consumed signals as verified-purchase substitutes.

## 2026-08-21 / Prompt 32.1

- Mở Inventory stock mutation và Order stock integration cho executable COD/VNPAY flows.
- Chốt transaction ownership, canonical idempotency identity, concurrent no-oversell và browser-return no-effect.

## 2026-08-21 / Prompt 32

- Ghi Inventory executable read authority cho Product/Cart/Order validation.
- Ghi Stock Mutation và Order Stock Integration BLOCKED do thiếu lifecycle reservation/deduction/release.

## 2026-08-06 / Prompt 06

### Added / Đã thêm

- Tạo Feature Index tại `.spec/features/README.md`.
- Tạo 34 feature specification folders.
- Tạo Status, Report, Checklist và ChangeLog cho `.spec/features`.

### Updated / Đã cập nhật

- Cập nhật `.spec/README.md` để ghi rõ Prompt 06 chỉ tạo business feature specification.
- Cập nhật root/doc index và work summary liên quan.

### Notes / Ghi chú

- Không tạo code.
- Không tạo database.
- Không tạo API.
- Không tạo frontend/backend.
- Không tạo UI.
