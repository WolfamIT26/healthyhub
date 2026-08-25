# Review Report / Báo cáo Review

## Prompt 33.2 result / Kết quả Prompt 33.2

Review Persistence, Eligibility, public/customer API và Rating Aggregate đều READY. Product Detail lấy dữ liệu authoritative; Ownership/Security và Concurrency PASS. Migration thứ 16 tạo một Review authority, không tạo cache/aggregate/moderation authority song song.

Create transaction khóa Order → Shipment, xác minh owner/Product/completed+delivered, rồi insert dưới unique `(tenant_id, order_id, product_id)`. Public verified badge được resolve động nên full return revoke badge nhưng giữ published content. Admin Review moderation vẫn ngoài scope.

Verification PASS: 364 unit tests, 12 MySQL files/25 tests, 16/16 migrations, OpenAPI 196/196/196 và toàn bộ format/lint/typecheck/build/secrets/docs/diff checks.

## Decision / Quyết định

**Review Eligibility: READY.** Customer ownership, Order/Product relation và completed+delivered purchase evidence đều executable.

| Candidate evidence / Bằng chứng ứng viên | Rejected reason / Lý do không dùng |
| --- | --- |
| Cart/Wishlist | Chỉ thể hiện intent, không phải mua hàng. |
| OrderPlaced | Xảy ra trước fulfillment. |
| Inventory consumed | COD consume ngay khi đặt; không chứng minh giao hàng. |
| Payment paid | Không chứng minh giao hàng và COD vẫn pending. |
| Order confirmed | Chỉ là effect của verified VNPAY paid IPN; không bao phủ COD. |
| `completed_at`/`delivered_at` đứng riêng | Chỉ hợp lệ khi đi kèm canonical Order/Shipment states; internal transition set atomically. |

## Result / Kết quả

Canonical identity là Order+Product. Future Review mặc định published, owner edit in-place, owner delete soft-delete; full return revoke verified-purchase badge/eligibility nhưng giữ content public. Refund Payment riêng không tự revoke nếu fulfillment chưa cancel/return.

Không tạo Review schema, controller/API, rating aggregate hoặc UI mutation vì Prompt 33.1 cấm các hạng mục đó. Internal eligibility resolver là dependency foundation, không phải Review CRUD.

Prompt 33.1 regression PASS: format/lint/typecheck/build, 335 unit tests, 11 MySQL files/18 integration tests, 15/15 migrations, OpenAPI 196/196/196 và secrets/docs/diff checks.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
