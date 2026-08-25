# Shipping Backend / Backend Shipping

`OrderFulfillmentService` is the internal application boundary. Its repository locks Order then Shipment, validates Payment readiness and separate state-machine transitions, persists Shipment status/timestamps/history and coordinates Order/Inventory effects in one transaction.

- `markShipped`: `pending → shipped`.
- `markDelivered`: `shipped → delivered` plus Order `new|confirmed → completed`.
- `cancelBeforeShipment`: `pending → cancelled` plus Order cancelled and stock restore.
- `markReturned`: `delivered → returned` plus Order returned and full-order restock.

Cancel/return require a reason. Timestamps cannot precede Order placement or the previous fulfillment milestone.

