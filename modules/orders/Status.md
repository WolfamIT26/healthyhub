# Order Status / Trạng thái module đơn hàng

## Current Status / Trạng thái hiện tại

`Order Fulfillment Lifecycle READY — internal runtime, persistence and Review evidence executable.`

Order create, Customer list/detail, verified Payment→Order mapping và internal fulfillment transitions đã executable. Canonical Order states là `new|confirmed|completed|cancelled|returned`; Shipment states là `pending|shipped|delivered|cancelled|returned`.

Browser visual không chạy được vì in-app Browser control không được expose trong runtime hiện tại; frontend automated tests đã kiểm tra direct URL, loading/empty/error, responsive structure và Guest/Internal route guard. Production preview smoke xác nhận `/orders` và `/orders/:orderId` direct URL trả SPA HTML 200.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`

Full Admin Order Management/Customer cancellation endpoint và provider refund execution vẫn ngoài scope; frontend không có status mutation control.
