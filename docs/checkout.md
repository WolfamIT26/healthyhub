# HealthyHub Checkout / Thanh toán tại checkout

## Status

**Prompt 27.3 Automated Verification PASS — VNPAY Sandbox E2E BLOCKED.**

`/checkout` là flow Customer thật. Nó reload Cart server, gate account chưa verified, validate thông tin nhận hàng, lấy Shipping quote authoritative, đọc danh sách payment method từ backend và cho phép chọn:

- `cod`
- `vnpay`

Khi chọn VNPAY, backend tạo Order trước rồi trả redirect URL sandbox; frontend chỉ điều hướng. Return screen chuyển sang Result, còn Result luôn reload `GET /payments/{paymentId}`. Browser return dù mang mã thành công cũng không tự đánh dấu `paid`; UI chỉ hiển thị state authoritative đã persist sau IPN.

COD vẫn giữ nguyên luồng cũ và không gọi provider.

Automated frontend regression và MySQL flow đã pass. Sandbox checkout thật chưa thể redirect/nhận IPN vì runtime chưa có terminal/hash secret và HTTPS public IPN callback, nên trạng thái thật là `BLOCKED — SANDBOX CREDENTIALS REQUIRED`.
