# Review Testing / Kiểm thử Review

## Prompt 33.2 coverage / Coverage Prompt 33.2

- DTO rating/content/identifier và mass-assignment rejection.
- Eligible/ineligible/foreign Customer/Product outside Order create boundaries.
- Exact retry, concurrent create, DB unique identity và conflicting duplicate.
- Owner update/delete/not-owned, soft-delete retry và update/delete race.
- Public pagination, average/distribution và deleted Review exclusion.
- Return revokes verified badge while content remains; failed audit FK rolls back insert.
- Product Detail aggregate/list/badge/loading/error/empty, Guest/ineligible/eligible and owner mutations.

Full verification: API 222 + Web 142 = 364 unit tests; MySQL 12 files/25 tests; 16/16 migrations; format/lint/typecheck/build/OpenAPI/secrets/docs/diff PASS.

## Prompt 33 result / Kết quả Prompt 33

Không thêm Review feature tests vì không có executable behavior để kiểm thử và stop condition cấm fake verified purchase.

Audit coverage xác nhận:

- owner derive từ JWT, không từ request `customerId`;
- Order Item/Product relation persisted;
- không có Order completed/delivered transition;
- COD `new/pending` và VNPAY `confirmed/paid` không tạo eligibility thống nhất;
- Product Detail tiếp tục no-fake rating/review.

Repository regression PASS: API 187 + Web 131 = 318 unit tests; 10 MySQL files/13 integration tests; migration 14/14; format/lint/typecheck/build/OpenAPI 196/196/196/secrets/docs/diff checks PASS.

## Prompt 33.1 coverage / Coverage Prompt 33.1

- Policy unit test cho completed+delivered evidence, missing timestamps, revoked state và Product absence.
- Service unit test cho JWT-derived Customer owner và owner-resolution failure.
- MySQL integration cho COD/VNPAY fulfillment, Customer A/B isolation, Product không thuộc Order, return revoke eligibility và Inventory restock.
- Không có Review CRUD/aggregate/frontend test vì các boundary đó chưa được triển khai.
