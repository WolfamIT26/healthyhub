# Shipping API / API Shipping

Checkout quote is the only current HTTP Shipping boundary. Prompt 33.1 adds no operation: shipment transitions are exposed only as internal `OrderFulfillmentService` commands because Admin/internal actor permissions are not yet executable.

Customer Order list/detail may read canonical Shipment statuses. Frontend cannot submit status, timestamp or actor authority.

