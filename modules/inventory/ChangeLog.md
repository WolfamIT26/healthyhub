# Inventory ChangeLog / Nhật ký Inventory

## 2026-08-21 — Prompt 32.1

- Chốt reserve ở OrderPlaced cho COD/VNPAY; COD consume ngay, VNPAY consume/release từ verified IPN.
- Thêm `stock_reservations`, canonical unique business identity và idempotent state transitions.
- Thêm pessimistic row locks/stable ordering để ngăn concurrent oversell và quantity âm.
- Hỗ trợ failed release, late-paid reacquire và internal restock; browser return không có stock effect.
- Không thêm Admin Inventory UI/API hoặc adjustment authority.

## 2026-08-21 — Prompt 32

- Dùng chung Inventory availability evaluator cho reader và Product public mapping.
- Sửa zero quantity không còn bị hiển thị in-stock khi persisted status bị trễ.
- Harden tenant-scoped Inventory lookup/join và Cart invalid read state.
- Xác nhận schema hiện tại đủ cho read authority nên không thêm migration.
- Ghi Stock Mutation và Order Stock Integration BLOCKED do lifecycle chưa đủ.
