# Checkout Backend Status

**Checkout integration executable.**

`POST /shipping/quotes` hiện là Customer-only endpoint, derive authoritative Cart và yêu cầu verified account trước khi trả manual quote. `POST /orders` tiếp tục revalidate toàn bộ và lưu Payment/Shipment selection snapshot ở trạng thái pending.

Prompt 27.2 mở rộng backend payment boundary:

- `GET /payments/methods` xuất COD + VNPAY theo capability server.
- `POST /payments/intents` chỉ tạo intent VNPAY sau khi Order đã persist và ownership/amount hợp lệ.
- `GET /payments/vnpay/return` và IPN callback xử lý verify/normalize/status query.
- Không có gateway/capture, fulfillment hoặc Inventory mutation.
