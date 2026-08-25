# Review ChangeLog / Nhật ký Review

## 2026-08-21 — Prompt 33.2

- Added `product_reviews` persistence with Order+Product uniqueness, validation constraints and soft delete.
- Added transactional eligibility recheck, exact retry/concurrent duplicate handling and owner row locks.
- Added typed public/customer Review API, authoritative aggregate and Product Detail integration.
- Kept Admin moderation, media/voting/comments/replies/rewards/AI outside scope.

## 2026-08-21 — Prompt 33.1

- Opened Review eligibility with authoritative completed+delivered Order/Shipment evidence.
- Added owner-scoped Product-in-Order resolver and fail-closed policy tests.
- Chose Order+Product duplicate identity and publication/edit/delete/return behavior.
- Kept Review persistence/API/aggregate/UI unimplemented as required.

## 2026-08-21 — Prompt 33

- Audited executable ownership and purchase evidence.
- Marked eligibility/persistence/API/aggregate BLOCKED because fulfillment completion is not executable.
- Kept Product Detail no-fake Review state and marked design OpenAPI operations runtime-blocked.
- Added no migration, controller, DTO, Review UI or Admin moderation.
