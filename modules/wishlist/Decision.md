# Wishlist Decisions / Quyết định Wishlist

- V1 uses one lazy default private Wishlist per active CustomerProfile.
- JWT→CustomerProfile is the only owner authority; no client `customerId`.
- Membership is persisted; name, price and availability remain current Product/Inventory data, not snapshots.
- Out-of-stock public Product can be saved; non-public current items render unavailable.
- Add is naturally idempotent through locking/uniqueness; remove-by-Product is idempotent.
- `/wishlist` is preserved to retain Prompt 24 route/UX contract.
