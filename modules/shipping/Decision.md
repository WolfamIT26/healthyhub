# Shipping V1 Decision — Prompt 26.1A

## Approved minimum internal strategy

Shipping physical design đã approved `shipping_method = manual` và `shipping_fee = 0.00`. Prompt 26.1A cho phép formalize minimum internal rule khi chưa có provider:

- method duy nhất: `manual` — HealthyHub xử lý giao hàng thủ công;
- fee: `0.00 VND`, tính phía server;
- serviceability: chỉ địa chỉ có `countryCode = VN` và recipient/phone/province/district/address line hợp lệ;
- không ETA vì chưa có nguồn authoritative;
- quote stateless, deterministic và revalidatable;
- không tạo Shipment cho tới Order/fulfillment phase.

Rule không đại diện GHN/GHTK/Viettel Post và không nhận fee/total từ frontend. Mở rộng khu vực, phí hoặc provider phải là decision mới.
