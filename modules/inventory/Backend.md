# Inventory Backend / Backend Inventory

## Authority / Nguồn thẩm quyền

`InventoryAvailabilityReader` và hàm đánh giá dùng chung chuẩn hóa các trạng thái `AVAILABLE`, `LOW_STOCK`, `INSUFFICIENT_STOCK`, `OUT_OF_STOCK`, `UNAVAILABLE`, `INVALID_QUANTITY` từ `inventory_items`.

Product public read model batch-join Inventory persistence và dùng cùng evaluator; zero quantity không thể hiển thị `in_stock`. Cart/Order dùng reader trực tiếp sau khi Product sellable được xác nhận.

## Stock Mutation / Mutation tồn kho

`InventoryStockMutationRepository` nhận caller-owned `EntityManager` và khóa Inventory rows theo thứ tự Product ổn định:

- `reserveForOrder`: `available -= quantity`, `reserved += quantity`, tạo reservation active.
- `consumeForOrder`: active thì `reserved -= quantity`; available không giảm lần hai. Released reservation từ late-paid IPN phải reacquire `available -= quantity` trước khi consume.
- `releaseForOrder`: active thì `available += quantity`, `reserved -= quantity`.
- `restockForOrder`: consumed thì `available += quantity`.

Order repository sở hữu transaction reserve + COD consume + aggregate persistence. Payment provider-event repository sở hữu transaction VNPAY transition + Payment/Order effect + event processed marker. Mọi transition retry cùng state là idempotent; state conflict hoặc invariant mismatch fail closed.
