# Shipping Module / Module giao hàng

Shipping owns the manual quote rule, immutable delivery snapshot and Shipment fulfillment state machine. Prompt 33.1 makes internal fulfillment executable without adding a provider or Admin UI/API.

Canonical states: `pending → shipped → delivered → returned`, or `pending → cancelled`.

