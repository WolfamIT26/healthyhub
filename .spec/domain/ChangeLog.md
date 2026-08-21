# Domain ChangeLog / Nhật ký thay đổi Domain Model

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
