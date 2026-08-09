# HealthyHub Order Creation Boundary

## Status

**READY for Checkout Prompt 26.2.**

Public boundary: `POST /api/v1/orders`, protected by Customer JWT and verified-email policy. `X-Idempotency-Key` is required.

The server resolves the Customer and active Cart, revalidates Product price/sellability and Inventory availability, recomputes the manual Shipping quote, accepts COD only, calculates VND totals, then atomically persists immutable Order snapshots. Retry with the same key and payload returns the existing Order; conflicting reuse is rejected.

This boundary does not implement Checkout UI, payment capture, shipment fulfillment, inventory reservation/mutation, cancellation or admin Order operations. Cart remains active until a later approved lifecycle decision.
