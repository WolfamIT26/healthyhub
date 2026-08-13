# Wishlist Backend / Backend Wishlist

NestJS `WishlistModule` contains Customer-guarded controller/service and TypeORM repository. `CustomerOwnerResolver` maps JWT account to active CustomerProfile. Product existence/public visibility and Inventory availability come from existing commerce readers.

The repository serializes add/remove on the Customer row, lazy-creates the private default Wishlist, reuses active duplicates, reactivates removed items and scopes every mutation through the owner Wishlist.
