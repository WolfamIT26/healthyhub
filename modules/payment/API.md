# Payment API Contract Status

Prompt 27.2 exposes executable Payment API for COD discovery and VNPAY Sandbox intent/status/return/IPN.

Public contract:

- `GET /api/v1/payments/methods`: trả danh sách phương thức backend hỗ trợ, hiện gồm `cod` và `vnpay`.
- `POST /api/v1/payments/intents`: Customer tạo VNPAY intent sau khi Order đã persist; request chỉ gửi `orderId` và `paymentMethod = vnpay`.
- `GET /api/v1/payments/:paymentId`: Customer query trạng thái Payment authoritative.
- `GET /api/v1/payments/vnpay/return`: xử lý browser return, verify signature nếu có và trả UX state.
- `GET /api/v1/webhooks/payment/vnpay`: nhận IPN/callback VNPAY và trả acknowledgment raw theo contract provider.

Frontend không gửi amount, currency, provider status hoặc signature. Status response dùng canonical Payment statuses.

Prompt 27.3 documents required VNPAY Return/IPN query fields in OpenAPI. Return verifies checksum/terminal/reference/amount and returns persisted state without mutation. IPN is the only browser-flow callback that claims provider events and applies transactional Payment/Order effects.

# Prompt 27.1A API boundary

No public API operation was added. The future VNPAY Return URL is non-authoritative; only a verified IPN/query path implemented in Prompt 27.2 may drive payment lifecycle changes.
