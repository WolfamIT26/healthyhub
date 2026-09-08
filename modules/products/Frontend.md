# Product Frontend / Frontend Product

`productApi` maps API decimal strings and persisted relations into the existing `ProductPresentationModel`. `/products` sends its URL query to the server; `/products/:slug` resolves on mount/reload; shared `ProductSearch` debounces 250 ms and aborts stale requests.

Loading/error/empty states, responsive filters/gallery, accessible labels and URL behavior remain. `catalog.data.ts` is not imported by Catalog/Detail/Search production paths; it remains an isolated fixture/Home foundation only. Add to Cart and Wishlist receive authoritative Product IDs.

Prompt 35 opens `/admin/products`, `/admin/products/new` and `/admin/products/:productId` inside the Prompt 34 Admin shell. The list uses server pagination/search/filter/sort and authoritative refetch after lifecycle/delete mutations. The form is grouped into Basic, Brand, Categories, Content, Nutrition, Ingredients, Dietary Tags, Media and Publication sections, maps to typed Admin Product API payloads and keeps Inventory quantity/Review moderation out of scope.

Frontend permission checks only control navigation and UX. Backend guards remain the authorization authority.
