# Product Decisions / Quyết định Product

- Public visibility requires Product active/public and an active/public primary Category.
- Current price is `products.base_price`; promotion price is not invented.
- Availability is derived from Product `sellable_status` plus Inventory `stock_status`; missing/disabled Inventory maps unavailable.
- Public list defaults featured then updated time, with Product ID stable tie-breaker.
- Rating/best-selling are rejected until Review/sales authority exists.
- Related Products are up to four public Products in the same primary Category.
- Only active/public Product image links with an absolute HTTP(S) public reference are exposed; raw storage keys are not returned.
