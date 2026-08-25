# Shipping Database / Database Shipping

Runtime tables are `shipments`, `shipping_addresses` and `shipping_status_histories`. Migration `1760000014000-enable-order-fulfillment-review-eligibility` constrains Shipment status to `pending|shipped|delivered|cancelled|returned` and creates durable history with Shipment `RESTRICT` FK, nullable actor `SET NULL` FK and tenant/shipment/time indexes.

Existing `shipped_at` and `delivered_at` are reused. No duplicate timestamp, delivery-attempt or provider-tracking schema was added. `synchronize=false` remains required.

