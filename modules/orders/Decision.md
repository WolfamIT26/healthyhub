# Order Decisions — Prompt 26.1B

- Prompt 32.1: Order creation transaction owns stock reserve before aggregate completion; COD consumes immediately at OrderPlaced, VNPAY remains active pending authoritative Payment outcome.
- Prompt 32.1: stable Inventory row locks and durable reservation identity prevent oversell and duplicate Order stock effects.

- Initial Order status: approved physical default `new`.
- Payment: `cod` hoặc `vnpay`, initial `pending`; không capture hoặc paid giả.
- Shipping: `manual`, fee authority `0.00 VND`; Shipment/address rows chỉ lưu immutable selection snapshot.
- Totals dùng decimal string và integer minor-unit arithmetic, không dùng floating point.
- Order number sinh server-side bằng ngày + 96-bit random suffix và unique DB constraint.
- Idempotency bổ sung tối thiểu hai SHA-256 hash columns trên `orders`; không lưu raw key.
- Cart không bị mutate sau create vì lifecycle transition chưa có approved rule.
- Prompt 27.1 mapping: verified `paid` may request `confirm_if_placed`. Other Payment statuses do not mutate Order; refund requires its own approved workflow.
- Prompt 27.2: verified VNPAY success may transition Order from `new` to `confirmed` through approved Payment service effect. COD remains `pending` and does not call provider.
- Prompt 27.3: browser return không apply effect; chỉ IPN verified được phép chuyển đúng `new → confirmed`. Payment service reload/lock persisted rows và không ép Order ngoài trạng thái nguồn đã approve.
- Prompt 28: Customer read namespace theo approved API là `/api/v1/me/orders`; frontend dùng `/orders` và `/orders/:orderId` theo yêu cầu màn hình hiện hành.
- Owner lấy từ authenticated context qua `CustomerOwnerResolver`; không nhận `customerId` từ query/body. Not-owned và invalid Order ID cùng trả `404 ORDER.NOT_FOUND` để tránh enumeration.
- List dùng page pagination, filter whitelist và stable sort `placedAt DESC, id DESC`. Detail đọc snapshot đã persist; canonical Payment status lấy từ Payment row, không lấy browser return hoặc React state.
- Chỉ trả VNPAY provider reference an toàn theo Payment contract; không expose signature, secret, payload provider hoặc provider-event metadata.
- Prompt 32: không gắn Inventory mutation vào Order create hoặc VNPAY confirmation cho tới khi chốt reserve-vs-deduct, COD confirmation, failed/cancelled release và Order cancellation/restock.
