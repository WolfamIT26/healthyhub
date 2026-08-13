# Checkout API Status

**Implemented as part of Checkout orchestration; no extra checkout-specific payment endpoint invented.**

Checkout vẫn dùng `POST /shipping/quotes` và `POST /orders`. Payment method list được lấy từ backend payment capability, hiện gồm `cod` và `vnpay` thông qua `GET /payments/methods`. Khi chọn VNPAY, frontend gọi payment intent sau khi Order đã persist.
