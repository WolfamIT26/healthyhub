# Prompt 33.2 - Reviews & Ratings Implementation V1

## Task / Nhiệm vụ

Triển khai Review persistence/API/rating aggregate/Product Detail thật dựa trên authoritative Order Fulfillment và Review Eligibility contract Prompt 33.1, không mở Admin moderation hoặc Prompt 34.

## Result / Kết quả

| Boundary / Ranh giới | Result / Kết quả |
| --- | --- |
| Review Persistence | **READY** |
| Review Eligibility | **READY** |
| Review API | **READY — public/customer subset** |
| Rating Aggregate | **READY** |
| Product Detail Integration | **PASS** |
| Ownership/Security | **PASS** |
| Concurrency | **PASS** |
| Regression | **PASS** |

## Persistence & Identity / Persistence và identity

- Migration `1760000015000-enable-reviews-ratings-v1` tạo `product_reviews` với required Customer/Product/Order FKs, audit/version và soft delete.
- Canonical identity là unique `(tenant_id, order_id, product_id)` và vẫn được giữ sau soft delete; một Product trong một Order không thể tạo identity thứ hai.
- Rating có DB/DTO range 1–5; trimmed content 3–2000; publication mặc định `published`; statuses được giới hạn `published|hidden|rejected`.
- Public/customer/order indexes phục vụ query thật. Không tạo aggregate cache, moderation/report hoặc authority song song.

## Eligibility, Security & Transactions / Eligibility, bảo mật và transaction

- Customer owner derive server-side từ JWT → CustomerProfile; DTO không nhận `customerId` hoặc `verifiedPurchase`.
- Create khóa Order rồi Shipment theo cùng thứ tự với Fulfillment, recheck owner, active Order Item Product, `completed`/`delivered` và timestamps trong transaction trước insert.
- Exact same create retry trả Review hiện có; conflicting duplicate trả 409. DB unique là final concurrent authority.
- Update/delete khóa row và owner-scope; missing/not-owned cùng safe 404. Delete idempotent và soft-delete.
- Public item không expose email, phone, Customer/Order internal IDs. React render content dạng text, không inject HTML.

## API & Aggregate / API và aggregate

- Public list có pagination, safe author label và verified-purchase badge động.
- Public summary trả average, total reviews và distribution 1–5 từ active/published persistence; deleted/hidden không được tính.
- `/me/reviews` trả owner list và optional Product eligibility opportunity; create/update/delete dùng typed whitelist DTO.
- Sáu public/customer OpenAPI operations executable. Hai Admin moderation operations vẫn blocked bằng `ADMIN_REVIEW_MODERATION_NOT_IMPLEMENTED`; inventory giữ 196 operations.

## Product Detail / Chi tiết sản phẩm

- Hiển thị authoritative average, total, distribution, Review list, verified badge và pagination.
- Có loading/error/retry/empty states, Guest login CTA và safe ineligible reason.
- Eligible Customer submit rating/content; owner edit/delete trực tiếp và refetch list/aggregate/evidence sau mutation.
- Full return giữ Review content nhưng Order/Shipment evidence được resolve lại nên verified badge bị revoke.
- Product public API shape không đổi; không dùng rating/review fixture hoặc client aggregate.

## Testing / Kiểm thử

- Eligible/ineligible/foreign Customer/Product outside Order, invalid rating/content và mass assignment.
- Exact retry, conflicting/concurrent duplicate, update/delete race, owner isolation, soft-delete retry và transaction rollback.
- Public pagination, average/distribution, deleted exclusion và return badge revocation.
- Product Detail public/Guest/ineligible/eligible/edit/delete/loading/error/empty integration.

## Verification / Kiểm tra

- Format check: **PASS**.
- Lint: **PASS**.
- Typecheck: **PASS**.
- Unit tests: **PASS — API 222 + Web 142 = 364 tests**.
- MySQL integration: **PASS — 12 files / 25 tests**, chạy sequential với toàn bộ opt-in flags.
- Migration state: **PASS — 16/16 applied**.
- Build: **PASS**.
- OpenAPI: **PASS — 196 operations / 196 unique IDs / 196 spec rows**.
- Secrets/docs/diff checks: **PASS**.

## Not Changed / Không thay đổi

- Không Admin Review moderation UI/API, AI moderation, media Review, helpful voting, comments, seller replies, rewards hoặc recommendation engine.
- Không đổi Payment, Fulfillment, Inventory lifecycle authority hoặc Product public API shape.
- Không tạo dedicated `/account/reviews` page; owner Review UX thuộc Product Detail V1 scope này.
- Không commit, push, merge hoặc bắt đầu Prompt 34.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
