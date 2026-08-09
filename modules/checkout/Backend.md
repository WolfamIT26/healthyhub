# Checkout Backend Status

**Checkout integration executable.**

`POST /shipping/quotes` hiện là Customer-only endpoint, derive authoritative Cart và yêu cầu verified account trước khi trả manual quote. `POST /orders` tiếp tục revalidate toàn bộ và lưu Payment/Shipment selection snapshot ở trạng thái pending. Không có gateway/capture, fulfillment hoặc Inventory mutation.
