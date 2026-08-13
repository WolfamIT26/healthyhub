# HealthyHub Payment / Thanh toán HealthyHub

## Status

**Prompt 28 dùng lại canonical persisted Payment state; không thay đổi Payment authority.**

HealthyHub hiện có hai phương thức thanh toán được backend công bố:

- `cod`: tạo Order và Payment trạng thái `pending`, không gọi provider.
- `vnpay`: tạo Order trước, sau đó tạo Payment attempt và URL redirect VNPAY Sandbox từ backend.

## Authority / Nguồn xác thực

- Amount lấy từ Order/Payment đã persist, frontend không gửi amount có thẩm quyền.
- Browser return chỉ phục vụ UX và điều hướng.
- Browser return verify checksum/reference/amount rồi trả Payment đang persist; endpoint này không claim provider event và không cập nhật Payment/Order.
- IPN/callback VNPAY đã verify signature là nguồn authoritative cập nhật Payment/Order; provider query chỉ là reconciliation server-side riêng.
- Event provider được dedupe theo provider/event identity để tránh double effect.
- Mismatch reference/amount/currency bị reject fail-closed.

## Sandbox Configuration Audit / Audit cấu hình Sandbox

Runtime hiện tại và `.env.development`, `.env.test`, `.env.production` chưa sẵn sàng cho VNPAY. Các biến còn thiếu/chưa chọn chính xác:

- `PAYMENT_PROVIDER=vnpay`
- `VNPAY_TMN_CODE` — terminal 8 ký tự do VNPAY Sandbox cấp
- `VNPAY_HASH_SECRET` — inject từ secret store/local environment, không ghi vào source/docs/log
- `VNPAY_PAYMENT_URL`
- `VNPAY_API_URL`
- `VNPAY_RETURN_URL`
- `VNPAY_IPN_URL` — HTTPS public callback đã đăng ký cho terminal Sandbox; localhost không nhận được IPN server-to-server

Hai endpoint Sandbox public được ghi trong file example; giá trị credential thật vẫn phải nằm ngoài Git. Docker API đã forward các biến trên nhưng không đặt default credential.

## Prompt 27.3 Verification / Kiểm tra Prompt 27.3

- Automated signed-fixture và MySQL integration: **PASS**.
- Payment URL lấy `vnp_Amount` từ `orders.order_total` sau khi đối chiếu `payments.payment_amount`.
- Invalid signature không tạo event; amount mismatch tạo event `failed` và không mutate Payment/Order.
- Browser return có kết quả `00/00` vẫn giữ Payment/Order `pending/new` cho tới IPN.
- Valid IPN cập nhật Payment `paid`, attempt `paid`, Order snapshot `paid` và Order `confirmed` trong một transaction; duplicate IPN không double effect.
- Reload Payment Result gọi backend và lấy authoritative persisted state.
- Database verification đã kiểm tra Order, OrderItem, Payment, PaymentAttempt, Shipment, address snapshot và provider-event rows; COD vẫn `pending/new` và không có attempt.
- Sandbox browser/real IPN chưa chạy vì credential/callback chưa cấu hình: **BLOCKED — SANDBOX CREDENTIALS REQUIRED**.

## Boundary / Giới hạn

Không dùng production credential, không đưa secret vào frontend, không fake success và không triển khai refund/admin settlement. Customer Order detail chỉ trả Payment method/status/amount, paid timestamp và provider reference an toàn; không trả signature, secret hoặc raw provider metadata.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`

## Official References / Nguồn chính thức

- [VNPAY PAY, Return URL và IPN contract](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html)
- [VNPAY Return URL và IPN authority FAQ](https://sandbox.vnpayment.vn/apis/docs/faqs/)
- [VNPAY QueryDr contract](https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr%26refund.html)
- [VNPAY response codes](https://sandbox.vnpayment.vn/apis/docs/bang-ma-loi/)
