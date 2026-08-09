# Shipping Authority Report — Prompt 26.1A

## Status

**READY — minimum internal Shipping V1 authority executable.**

## Capability

`ShippingQuoteService` cung cấp:

- `getAvailableMethods(address, cart)`;
- `quote(address, method, cart)`;
- `validateQuote(reference, address, method, cart)`;
- reusable normalized `ShippingAddressSnapshot`.

Method duy nhất là `manual`, fee server-authoritative `0.00 VND`, không ETA/provider. Chỉ địa chỉ `VN` hợp lệ được serviceable. Quote reference deterministic theo normalized address + authoritative Cart context.

Không có Shipment persistence/fulfillment, provider API, Admin UI hoặc frontend Checkout trong prompt này.

Chi tiết quyết định: [Decision.md](Decision.md).
