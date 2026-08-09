# HealthyHub Shipping Authority V1

## Status

**READY for Checkout internal consumption.**

Shipping V1 dùng rule nội bộ tối thiểu theo approved physical defaults:

- method: `manual`;
- method name: Giao hàng tiêu chuẩn HealthyHub;
- fee: `0.00 VND`, chỉ do server trả;
- serviceability: địa chỉ Việt Nam (`countryCode = VN`) có recipient, phone, province/city, district và address line hợp lệ;
- ward/note optional;
- ETA: `null`, vì chưa có provider/source authoritative.

Quote stateless, deterministic và gắn normalized address + Cart ID/subtotal/item count/validity. Checkout phải quote/revalidate lại trước Order creation. Client không gửi shipping fee hoặc total.

Không có provider call, Shipment row, tracking, fulfillment, Inventory mutation hoặc Shipping Admin UI.
