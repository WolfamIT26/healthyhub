# Product Domain / Domain sản phẩm

## Purpose / Mục đích

Quản lý sản phẩm healthy được bán, nội dung, trạng thái bán và các thuộc tính thương mại.

## Responsibility / Trách nhiệm

- Bảo vệ điều kiện sản phẩm được public và được bán.
- Gắn sản phẩm với Category, Brand, Media và Inventory.
- Quản lý thông tin thành phần, lưu ý và cảnh báo dị ứng ở mức nghiệp vụ.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `Product`
- Entity: `ProductContent`, `ProductIngredient`, `ProductMediaLink`
- Value Object: `ProductName`, `ProductDescription`, `IngredientInfo`, `AllergyWarning`
- Enum: `ProductStatus`, `SellableStatus`, `ProductVisibility`

## Relationships / Quan hệ với domain khác

- Phụ thuộc Category, Brand và Media.
- Inventory quyết định khả năng bán thực tế.
- Cart, Order, Review, AI và Analytics tham chiếu Product.

## Business Rule / Quy tắc nghiệp vụ

- Product public phải có thông tin tối thiểu.
- Product phải có category chính khi public.
- Product hết hàng không được hiển thị như còn mua được.
- Không được đưa claim y tế sai lệch vào content.

## Domain Event / Sự kiện domain

- `ProductCreated`
- `ProductPublished`
- `ProductHidden`
- `ProductContentUpdated`
- `ProductSellableStatusChanged`

## Dependency / Phụ thuộc

- Core dependency: Category, Brand, Media
- Downstream: Inventory, Cart, Order, Review, AI, Analytics

## Boundary / Ranh giới

Product không xử lý order, payment hoặc shipping. Domain này chỉ quản lý sự đúng đắn của thông tin và trạng thái sản phẩm.

