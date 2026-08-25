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

## Prompt 33.1 fulfillment decisions

- Shipment states are exactly `pending|shipped|delivered|cancelled|returned`; no preparing/failed/provider state is invented.
- Internal Fulfillment service owns transitions. Frontend/browser and Payment do not own Shipment status.
- COD can ship while Payment pending; VNPAY requires verified paid and Order confirmed.
- Delivered atomically completes Order and creates Review evidence. Cancel is only pre-shipment; return is full-order only after delivered.
