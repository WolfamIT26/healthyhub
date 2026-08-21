# HealthyHub Shopping Cart V1

## Status

**Cart Persistence: Server-side implemented.**

Customer Cart dùng MySQL làm source of truth. Reload trình duyệt hoặc logout/login lại cùng Customer sẽ fetch lại Cart; account khác nhận Cart riêng. Client không dùng localStorage/sessionStorage và không giữ memory state như persistence.

## API and ownership

- `GET /api/v1/cart`
- `POST /api/v1/cart/items` — `{ productId, quantity }`
- `PATCH /api/v1/cart/items/{cartItemId}` — `{ quantity }`
- `DELETE /api/v1/cart/items/{cartItemId}`

Owner derive từ authenticated CUSTOMER actor qua CustomerProfile. Client không gửi owner/user/customer ID. Guest được yêu cầu Login; guest-token Cart và merge chưa có executable transport contract nên chưa triển khai.

## Authority and consistency

- Giá, sellable state, name và slug đọc qua Product authority.
- Availability/quantity đọc qua Inventory authority; Cart không reserve hoặc mutate stock.
- Line total/subtotal tính chính xác phía server; không persist derived current price/total.
- Duplicate Product merge transactionally. Row lock + unique constraint ngăn double Add tạo hai dòng.
- Out-of-stock/unavailable Product còn đọc được vẫn hiển thị và chặn Checkout, không tự xóa. Nếu persisted Product không còn đọc được, Cart bị đánh dấu invalid thay vì vô tình coi là hợp lệ.

## Frontend behavior

- CartProvider initial fetch và dùng server response sau add/update/remove.
- Loading, retry, mutation error và pending item state đầy đủ.
- Header count lấy từ server-backed Cart.
- Logout/account switch reset client provider; không xóa Cart server.
- Unverified Customer vẫn dùng Cart; Checkout giữ verification modal của Prompt 18.6.

## Development seed

Development-only seed idempotent cung cấp Product/Inventory IDs 1–24 tương ứng catalog để kiểm thử API thật. Seed không tạo account/secret và không chạy ngoài development.

## Deferred

Guest Cart/merge và Cart coupon/validate action. Cart vẫn không reserve stock; reservation bắt đầu ở authoritative Order creation theo Prompt 32.1.
