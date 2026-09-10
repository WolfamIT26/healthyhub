# Product Decisions / Quyết định Product

- Public visibility requires Product active/public and an active/public primary Category.
- Current price is `products.base_price`; promotion price is not invented.
- Availability is derived from Product `sellable_status` plus Inventory `stock_status`; missing/disabled Inventory maps unavailable.
- Public list defaults featured then updated time, with Product ID stable tie-breaker.
- Rating/best-selling are rejected until Review/sales authority exists.
- Related Products are up to four public Products in the same primary Category.
- Only active/public Product image links with an absolute HTTP(S) public reference are exposed; raw storage keys are not returned.
- Prompt 35 Admin create starts every Product as `draft`, `hidden` and `unavailable`; publish/activation is a separate explicit lifecycle mutation.
- `product_code` is the canonical SKU and is immutable after create.
- Admin update replaces approved child relations transactionally instead of creating a second Product write model.
- Existing active Product image Media can be linked; arbitrary URLs and upload infrastructure remain outside Product management.
- Soft delete targets the Product row only and does not cascade into historical commerce, Review, Inventory, Category or Media data.
