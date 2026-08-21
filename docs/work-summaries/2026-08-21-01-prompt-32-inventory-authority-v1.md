# Prompt 32 - Inventory Authority V1 / Thẩm quyền tồn kho V1

## Task / Nhiệm vụ

Hoàn thiện Inventory V1 thành backend read/validation authority, reuse persistence/contracts hiện có, bảo vệ Product/Cart integration và chỉ mở Order stock mutation khi lifecycle canonical đủ rõ.

## Result / Kết quả

| Boundary / Ranh giới | Result / Kết quả |
| --- | --- |
| Inventory Persistence | **READY** |
| Inventory Authority | **READY** |
| Stock Mutation | **BLOCKED** |
| Order Stock Integration | **BLOCKED** |

## Implemented / Đã triển khai

- Tách Inventory availability evaluator dùng chung và giữ `InventoryAvailabilityReader` làm internal authority contract.
- Product read model batch-load internal quantity chỉ để đánh giá availability; public response không expose quantity.
- Zero quantity luôn map out-of-stock dù `stock_status` persisted bị trễ; missing/deleted/disabled map unavailable.
- Inventory lookup và Product join được scope theo tenant hiện hành.
- Cart update reject vượt stock/Product không sellable; Cart read có persisted Product không đọc được sẽ invalid.
- Bổ sung unit/migration/MySQL coverage cho zero, missing, deleted, disabled, invalid Product FK, negative quantity và duplicate Inventory authority.

## Persistence Decision / Quyết định persistence

Không thêm migration. `inventory_items` đã có `INT UNSIGNED`, check quantity không âm, Product FK `RESTRICT`, unique `(tenant_id, product_id)` và status indexes. Tạo adjustment/reservation/idempotency schema khi lifecycle chưa duyệt sẽ tạo authority song song hoặc business rule giả.

## Blocked Lifecycle / Lifecycle bị chặn

Order create là `new/pending`; verified VNPAY IPN có thể chuyển Order sang confirmed, nhưng COD không có confirmation transition executable. Repository chưa quyết định:

- reserve hay deduct tại OrderPlaced/OrderConfirmed;
- TTL/release khi VNPAY pending, failed hoặc cancelled;
- thời điểm COD giữ/trừ tồn;
- restock khi Order cancel/refund;
- mutation idempotency identity và transaction ownership.

Vì vậy browser return/IPN/Order create không được gắn stock effect trong Prompt 32. Đề xuất Prompt 32.1 chỉ để approve lifecycle matrix và persistence/idempotency contract.

## Verification / Kiểm tra

- Format check: **PASS**.
- Lint: **PASS**.
- Typecheck: **PASS**.
- Unit tests: **PASS — API 184 + Web 131 = 315 tests**.
- MySQL integration: **PASS — 10 files / 13 tests**, chạy sequential với toàn bộ opt-in flags.
- Migration state: **PASS — 13/13 applied**, không có migration Prompt 32.
- Build: **PASS**.
- OpenAPI: **PASS — 196 operations / 196 unique IDs / 196 spec rows**.
- Secrets/docs checks: **PASS**.

## Not Changed / Không thay đổi

- Không Admin Inventory UI/API.
- Không stock adjustment, reservation, deduction, release hoặc warehouse/supplier/purchase order.
- Không đổi Product/Cart public API shape hoặc OpenAPI operation count.
- Không đổi Checkout, COD, VNPAY return/IPN, Order hoặc Payment business effect.
- VNPAY Sandbox E2E thật tiếp tục phụ thuộc credential/public HTTPS callback ngoài Prompt 32.
