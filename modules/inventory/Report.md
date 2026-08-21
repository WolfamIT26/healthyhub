# Inventory Report / Báo cáo Inventory

## Result / Kết quả

`inventory_items` và `InventoryAvailabilityReader` tiếp tục là authority duy nhất cho stock quantity/availability. Prompt 32 dùng chung evaluator giữa reader và Product read model để zero quantity luôn out-of-stock, kể cả khi `stock_status` chưa đồng bộ; quantity không được đưa ra Product public response.

Cart add/update revalidate Product sellable + Inventory phía server. Cart read không còn tự coi hợp lệ khi persisted Product không đọc được. Order create giờ reserve atomically; COD consume ngay, VNPAY giữ reservation tới verified IPN.

## Persistence Audit / Audit persistence

Migration Prompt 32.1 thêm `stock_reservations` với Inventory/Order FK `RESTRICT`, positive quantity, state whitelist, lookup indexes và unique `(tenant_id, order_id, inventory_item_id)`. Không thêm adjustment ledger vì current business effects được ghi đủ bằng reservation lifecycle.

## Lifecycle Result / Kết quả lifecycle

**Order Stock Integration: READY.** Reserve xảy ra trong Order transaction; COD commit reservation tại OrderPlaced. VNPAY paid consume, failed/cancelled release trong cùng provider-event transaction; browser return vẫn read-only. Duplicate event được chặn bởi provider event identity và reservation state.

Payment policy cho phép late `failed → paid`, nên flow reacquire stock bằng row lock trước khi confirm; thiếu stock làm toàn transaction fail và giữ Payment cũ để reconciliation. VNPAY pending giữ reservation cho tới terminal Payment authority, không dùng clock/URL expiry làm failure giả.

## Verification / Kiểm tra

Format/lint/typecheck/build PASS; API 187 và Web 131 unit tests PASS; 10 MySQL integration files/13 tests PASS; 14/14 migrations applied; OpenAPI 196 operations, secrets/docs/diff checks PASS.
