# Wishlist Testing / Kiểm thử Wishlist

API unit tests cover empty/list pagination, add, missing/non-public Product, removal, Internal owner rejection and validation. MySQL integration covers concurrent double-add, one Wishlist/item, reload, Customer A/B isolation, missing Product, out-of-stock state and remove/re-add.

Frontend tests cover initial fetch, add/remove/refetch, duplicate pending click, loading/error/retry/empty, reload/remount, logout/login, account switch, Guest/Internal/unverified policy and Catalog/Detail regression.
