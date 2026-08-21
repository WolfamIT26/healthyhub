# Inventory API / API Inventory

## Executable Contract / Contract đã chạy

Prompt 32.1 không thêm public/admin Inventory endpoint. Product public API chỉ phát `availability` và `sellable`; quantity nội bộ không xuất hiện trong response.

Cart và Order tiếp tục dùng endpoint hiện tại, nhưng backend tự đọc Product/Inventory:

- `POST /api/v1/cart/items`
- `PATCH /api/v1/cart/items/{cartItemId}`
- `POST /api/v1/orders`

Verified `POST /api/v1/webhooks/payment/vnpay` dùng internal stock transition trong cùng provider-event transaction. Browser return không mutate stock. OpenAPI operation inventory giữ 196.

## Deferred Contract / Contract chưa mở

Các endpoint `/api/v1/admin/inventory/*` trong design specification chưa executable. Adjustment còn thiếu exact request/idempotency persistence và authorization implementation; không tạo contract song song trong Prompt 32.1.
