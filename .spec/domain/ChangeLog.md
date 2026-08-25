# Domain ChangeLog / Nhật ký thay đổi Domain Model

## 2026-08-21 — Prompt 33.2

- Implemented ProductReview aggregate ownership, identity, publication and soft-delete behavior.
- Formalized dynamic verified evidence after return and active/published aggregate reads.

## 2026-08-21 — Prompt 33.1

- Aligned Order/Shipment authority, cancellation/full-return effects and Order+Product Review identity.

## [0.4.0] - 2026-08-21

- Recorded Prompt 33 Review eligibility as BLOCKED pending executable Order completion/delivery authority.
- Required owner-scoped Order Item evidence and prohibited payment/order-placement inference.

## [0.3.0] - 2026-08-21

- Approved Prompt 32.1 OrderPlaced reservation, immediate COD consumption and verified VNPAY consume/release lifecycle.
- Added late-paid reacquire and authoritative cancellation/refund release/restock rules without inventing missing runtime transitions.

## [0.2.0] - 2026-08-21

- Refined Inventory V1 authority, zero-stock rule và explicit Order mutation blocker.

## [0.1.0] - 2026-08-06

### Added / Đã thêm

- Tạo Domain Model cho HealthyHub tại `.spec/domain`.
- Tạo Domain Index, Domain Overview, Domain Dependency Map, Ubiquitous Language và Business Constraints.
- Tạo 23 domain model chi tiết trong `.spec/domain/domains`.
- Tạo Status, Report, Checklist và ChangeLog cho Domain Model.

### Notes / Ghi chú

- Phạm vi chỉ là domain modeling.
- Không sinh code, database, API, frontend, backend hoặc UI.
