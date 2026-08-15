# Product Frontend / Frontend Product

`productApi` maps API decimal strings and persisted relations into the existing `ProductPresentationModel`. `/products` sends its URL query to the server; `/products/:slug` resolves on mount/reload; shared `ProductSearch` debounces 250 ms and aborts stale requests.

Loading/error/empty states, responsive filters/gallery, accessible labels and URL behavior remain. `catalog.data.ts` is not imported by Catalog/Detail/Search production paths; it remains an isolated fixture/Home foundation only. Add to Cart and Wishlist receive authoritative Product IDs.
