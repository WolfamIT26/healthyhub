# Wishlist Frontend / Frontend Wishlist

`WishlistProvider` is keyed by authenticated Customer actor. It initial-loads API state, exposes shared membership to Catalog/Detail/`/wishlist`, deduplicates pending Product mutations and refetches after success.

Loading, error/retry, empty and populated/out-of-stock states are responsive. Guest heart opens the existing safe Login prompt. Dynamic accessible labels and `aria-pressed` remain. No local/session storage is used.
