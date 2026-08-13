# Order Status / Trạng thái module đơn hàng

## Current Status / Trạng thái hiện tại

`Customer Orders V1 implemented — full automated/MySQL verification PASS.`

Order create, Customer list/detail và verified Payment→Order mapping đã executable. Prompt 28 không thêm mutation, provider hoặc migration.

Browser visual không chạy được vì in-app Browser control không được expose trong runtime hiện tại; frontend automated tests đã kiểm tra direct URL, loading/empty/error, responsive structure và Guest/Internal route guard. Production preview smoke xác nhận `/orders` và `/orders/:orderId` direct URL trả SPA HTML 200.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
