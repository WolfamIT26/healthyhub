# Admin ChangeLog / Nhật ký Admin

## 2026-08-27 — Prompt 35

- Opened Admin Products navigation and routes on top of Prompt 34 shell.
- Added current-permission Product management boundary with `products:read` and `products:manage`.
- Kept Inventory, Orders, Reviews moderation, User/Role management and upload/import/export disabled.

## 2026-08-25 — Prompt 34

- Added current-state Internal authorization and `analytics:read` permission mapping.
- Added typed, tenant-scoped Admin Dashboard API over canonical Product/Inventory/Order/Review persistence.
- Rebuilt `/admin` as a responsive guarded application shell with real loading/error/empty states.
- Kept non-executable modules disabled and Review moderation blocked.
