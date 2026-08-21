# Cart Decisions — Prompt 25.7 Server Persistence

## Decision status

**APPROVED AND EXECUTABLE — Customer Cart V1 server persistence.**

Ngày quyết định: 2026-08-09.

## Resolved executable contract

1. Cart V1 server persistence chỉ nhận Customer JWT. Guest Cart/merge tiếp tục deferred vì chưa có approved guest-token transport/lifecycle; Guest Add giữ safe Login flow.
2. Owner luôn derive `authenticated userAccountId → active CustomerProfile`; request không nhận `customerId`, `ownerId` hoặc `userId`. Internal role bị từ chối.
3. Request Add chỉ có BIGINT `productId` và quantity 1–9999. Update chỉ có quantity. Variant/options chưa có trong executable Product contract nên duplicate key V1 là Cart + Product.
4. Một active Cart cho mỗi Customer/tenant. Cùng Product được merge trong transaction; CustomerProfile row lock và unique constraints serialize cả double Add từ Cart rỗng.
5. `cart_items` không persist current price, subtotal, total hoặc stock. `item_price_snapshot` giữ null; response luôn đọc Product/Inventory authority và tính money bằng integer minor units.
6. Remove chuyển item sang `removed` soft lifecycle. Add lại reactivates row; active duplicate vẫn bị persistence constraint chặn.
7. Thumbnail chưa có trong executable Product persistence nên Cart response trả `null`, không phát minh media URL.
8. Cart-specific OpenAPI request/read model thay schema generic chỉ cho bốn operation đã triển khai. Coupon, validate, merge và guest flow không được implement trong Prompt 25.7.

## Development data

Development seed idempotent tạo Product BIGINT 1–24 và Inventory tương ứng để frontend catalog có server authority thật. Seed chỉ chạy khi environment là `development`, không tạo account/secret và không được dùng trong production.

## Preserved policy

- Unverified Customer dùng Add/Get/Update/Remove bình thường; email verification chỉ gate Checkout.
- Server không tin client price, total, stock hoặc ownership.
- Không localStorage/sessionStorage, Inventory reservation/mutation, Checkout, Coupon, Order hay Payment.

Prompt 32.1 override cho downstream lifecycle: Cart vẫn không mutate stock; `POST /orders` reserve từ persisted Cart trong Order-owned transaction.
