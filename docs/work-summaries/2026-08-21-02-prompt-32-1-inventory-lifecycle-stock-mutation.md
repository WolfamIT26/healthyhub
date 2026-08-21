# Prompt 32.1 - Inventory Lifecycle & Stock Mutation Contract

## Task / Nhiệm vụ

Chốt canonical stock lifecycle cho COD/VNPAY, thêm durable mutation/idempotency persistence và tích hợp stock effect vào đúng Order/Payment transaction mà không mở Admin Inventory UI/API.

## Result / Kết quả

| Boundary / Ranh giới | Result / Kết quả |
| --- | --- |
| Inventory Lifecycle | **READY** |
| Stock Mutation | **READY** |
| Order Stock Integration | **READY** |
| COD Stock Lifecycle | **READY** |
| VNPAY Stock Lifecycle | **READY** |
| Idempotency | **PASS** |
| Concurrency Protection | **PASS** |
| Regression | **PASS** |

## Canonical Lifecycle / Lifecycle chuẩn

| Business event / Sự kiện | Reservation / Stock effect |
| --- | --- |
| OrderPlaced — COD | Reserve trong Order transaction, sau đó consume ngay. `available` giảm một lần; `reserved` trở về 0. |
| OrderPlaced — VNPAY | Reserve trong Order transaction và giữ `active` khi Payment pending. |
| Browser return | Không mutate Payment, Order hoặc stock. |
| Verified VNPAY paid IPN | Consume active reservation trong cùng provider-event business transaction. |
| Verified VNPAY failed/cancelled IPN | Release active reservation; trả quantity về available. |
| Late paid sau failed | Reacquire available stock bằng row lock rồi consume. Thiếu stock làm rollback và giữ Payment cũ để reconciliation. |
| Authoritative cancel trước consume | Future Order cancellation transaction phải release. Runtime hiện chưa có cancellation transition. |
| Authoritative cancel/refund sau consume | Future Order/refund transaction phải restock. Internal idempotent restock primitive đã có; runtime caller hiện chưa tồn tại. |

VNPAY pending không có Inventory-owned TTL. Payment attempt expiry hiện chỉ giới hạn attempt/URL và repository chưa có authoritative timeout transition hoặc scheduler; Inventory không dùng browser return hay clock riêng để tự tuyên bố Payment failed. Reservation chỉ release khi Payment authority phát terminal failed/cancelled event.

## Persistence & Idempotency / Persistence và idempotency

- Migration `1760000013000-enable-inventory-stock-lifecycle-v1` tạo `stock_reservations`.
- `inventory_items` tiếp tục là quantity/availability authority; reservation không tạo authority song song.
- Canonical business identity là unique `(tenant_id, order_id, inventory_item_id)`.
- State lifecycle: `active → consumed|released`, `consumed → restocked`; late paid dùng `released → consumed` sau atomic reacquire.
- Reservation lưu timestamps reserved/consumed/released/reacquired/restocked và audit/version fields.
- Không tạo `stock_adjustments`: current Order/Payment effects đã được ghi đủ bằng reservation lifecycle; manual adjustment chưa thuộc scope.
- Payment provider-event identity tiếp tục dedupe IPN; reservation state bảo vệ stock effect retry/concurrent duplicate.

## Transaction Ownership / Sở hữu transaction

- `TypeOrmOrderRepository.createSnapshot` sở hữu Order row, reserve, COD consume, OrderItem, Payment, Shipment và address snapshot trong một transaction.
- Verified VNPAY IPN dùng `TypeOrmPaymentProviderEventRepository.completeWithBusinessEffect`; stock transition, Payment/Order effect và event `processed` commit/rollback cùng nhau.
- Inventory rows được pessimistic-write lock theo `inventory_item_id` ổn định. Concurrent Orders serialize tại quantity authority; runtime không cho available/reserved xuống âm.
- Order service vẫn prevalidate để trả lỗi sớm, nhưng locked mutation trong transaction là final no-oversell authority.

## Testing / Kiểm thử

- COD reserve + immediate consume và same Order idempotency retry.
- VNPAY pending reservation; browser return no effect; paid consume; duplicate paid IPN no double effect.
- Failed IPN release; duplicate failed IPN; late-paid reacquire + consume.
- Transaction failure sau reserve rollback cả Order/reservation/quantity.
- Hai concurrent COD Orders trên stock không đủ: đúng một Order commit, stock không âm.
- Idempotent restock retry.
- Product/Cart/Customer Order/Profile snapshot regressions dùng Product/Inventory thật.
- Migration unit coverage cho FK, status/check/index/unique identity và no independent `expires_at`.

## Verification / Kiểm tra

- Format check: **PASS**.
- Lint: **PASS**.
- Typecheck: **PASS**.
- Unit tests: **PASS — API 187 + Web 131 = 318 tests**.
- MySQL integration: **PASS — 10 files / 13 tests**, chạy sequential với toàn bộ opt-in flags.
- Migration state: **PASS — 14/14 applied**.
- Build: **PASS**.
- OpenAPI: **PASS — 196 operations / 196 unique IDs / 196 spec rows**.
- Secrets/docs/diff checks: **PASS**.

## Not Changed / Không thay đổi

- Không Admin Inventory UI/API.
- Không manual adjustment, warehouse, supplier, purchase order, stock transfer, batch/lot, expiry, analytics hoặc low-stock notification.
- Không đổi Product/Cart public API shape hoặc OpenAPI operation count.
- Không tạo Order cancellation/refund endpoint hay status transition chưa có trong canonical runtime.
- Không dùng browser return làm payment/stock authority.
- Không commit, push hoặc merge; không bắt đầu Prompt 33.
