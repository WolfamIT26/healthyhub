# Prompt 33 - Reviews & Ratings V1 / Đánh giá sản phẩm V1

## Task / Nhiệm vụ

Audit và triển khai Reviews & Ratings V1 thật từ database nếu Customer purchase eligibility có canonical executable lifecycle; nếu chưa đủ thì dừng fail-closed, không fake verified purchase.

## Result / Kết quả

| Boundary / Ranh giới | Result / Kết quả |
| --- | --- |
| Review Persistence | **BLOCKED** |
| Review Eligibility | **BLOCKED** |
| Review API | **BLOCKED** |
| Rating Aggregate | **BLOCKED** |
| Product Detail Integration | **FAIL — real Review integration not opened** |
| Ownership/Security | **PASS — foundation audited; no unsafe endpoint exposed** |
| Regression | **PASS** |

## Canonical Evidence / Bằng chứng canonical

- Authentication guard và `CustomerOwnerResolver` derive Customer owner từ JWT; frontend không cần/không được gửi `customerId` authority.
- Customer Order repository/service đã owner-scope persisted Order aggregate và Order Item có `productId`.
- Executable `OrderEntity.orderStatus` chỉ là `new|confirmed`; `ShipmentEntity.shippingStatus` chỉ là `pending`.
- `completedAt`, `shippedAt`, `deliveredAt` là nullable fields nhưng repository không có authoritative fulfillment transition set các field này.
- COD OrderPlaced giữ Order `new`/Payment `pending` dù stock consume ngay; verified VNPAY paid IPN có thể set Order `confirmed`. Vì thế `confirmed`/`paid` không phải eligibility chung và cũng không chứng minh giao hàng.

## Decision / Quyết định

**Review Eligibility: BLOCKED.** Không chọn Cart/Wishlist, OrderPlaced, Inventory consumed, browser return, Payment paid hoặc Order confirmed làm verified-purchase evidence. Prompt 33 yêu cầu dừng khi lifecycle chưa đủ, nên không tạo Review persistence/API/aggregate/UI nửa vời.

Để mở khóa cần approve và implement:

1. authoritative delivered/completed event/state, transition owner và timestamp cho COD/VNPAY;
2. cancellation, return và refund effect lên eligibility/review đã tạo;
3. duplicate identity: Customer/Product, Order/Product hay Order Item;
4. default publication status và owner edit/delete lifecycle phù hợp scope không Admin UI.

## Documentation / Tài liệu

- Tạo Review module README/Requirement/Database/API/Frontend/Backend/Testing/Checklist/Prompt/Status/Report/ChangeLog/Decision/TODO.
- Đồng bộ Review feature/domain/logical DB/physical DB/API/UI contract và changelogs/status liên quan.
- Đánh dấu 8 Review OpenAPI operations `x-runtime-status: blocked` với blocker `ORDER_FULFILLMENT_LIFECYCLE_REQUIRED`; giữ operation inventory 196.
- Cập nhật Product Detail/Product module, root ChangeLog, `TONG_HOP_DA_LAM` và Work Summary index.

## Verification / Kiểm tra

- Format check: **PASS**.
- Lint: **PASS**.
- Typecheck: **PASS**.
- Unit tests: **PASS — API 187 + Web 131 = 318 tests**.
- MySQL integration: **PASS — 10 files / 13 tests**, chạy sequential với toàn bộ opt-in flags.
- Migration state: **PASS — 14/14 applied**, không có Review migration.
- Build: **PASS**.
- OpenAPI: **PASS — 196 operations / 196 unique IDs / 196 spec rows**.
- Secrets/docs/diff checks: **PASS**.

## Not Changed / Không thay đổi

- Không thêm Review migration/entity/repository/service/controller/DTO/shared type.
- Không thêm Product rating/review response field, Review aggregate hoặc frontend Review form/list.
- Không Admin Review UI, AI moderation, media upload, rewards, helpful voting, comments, seller reply hoặc Prompt 34.
- Không đổi Order/Payment/Inventory lifecycle để phục vụ Review ngoài phạm vi Prompt 33.
- Không commit, push hoặc merge.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
