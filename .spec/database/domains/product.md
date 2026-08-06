# Product Database / Database domain sản phẩm

## Storage Purpose / Mục đích lưu trữ

Lưu dữ liệu sản phẩm healthy, nội dung mô tả, thành phần, cảnh báo dị ứng và liên kết media để phục vụ catalog, bán hàng, tìm kiếm và AI.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `products` | Sản phẩm chính được bán. |
| `product_contents` | Nội dung mô tả, SEO và hướng dẫn sử dụng. |
| `product_ingredients` | Thành phần, dinh dưỡng, cảnh báo dị ứng. |
| `product_media_links` | Liên kết sản phẩm với media. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `products` | `id` | `tenant_id`, `product_code`, `product_name`, `slug`, `base_price`, `sellable_status`, `product_visibility`, `product_status` | `brand_id` -> Brand nullable | draft, active, hidden, discontinued |
| `product_contents` | `id` | `tenant_id`, `description`, `summary`, `usage_note`, `seo_title`, `seo_description`, `content_status` | `product_id` | draft, review, published |
| `product_ingredients` | `id` | `tenant_id`, `ingredient_name`, `ingredient_description`, `nutrition_note`, `allergy_warning`, `display_order` | `product_id` | active, hidden |
| `product_media_links` | `id` | `tenant_id`, `media_role`, `display_order`, `link_status` | `product_id`, `media_asset_id` -> Media | active, inactive |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Một product có thể có một content chính ở MVP.
- 1-N: Một product có nhiều ingredient và media link.
- N-N: Product và Category qua `product_category_links`; Product và Media qua `product_media_links`.
- Cardinality: Product public phải có ít nhất một category chính và media phù hợp.

## Business Constraints / Ràng buộc nghiệp vụ

- Product chỉ được bán khi `sellable_status` và `product_visibility` cho phép.
- Product public phải có tên, mô tả, giá, category và media tối thiểu.
- Cảnh báo dị ứng hoặc lưu ý sức khỏe phải gắn với product/ingredient khi có.

## Delete Strategy / Chiến lược xóa

- Product dùng soft delete hoặc discontinued nếu đã từng xuất hiện trong order.
- Content và ingredient có thể hidden; không hard delete nếu đã public hoặc đã dùng cho AI/SEO.
- Media link có thể inactive khi thay ảnh.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Product và content nên có `version` để kiểm soát chỉnh sửa nội dung.

## Data Lifecycle / Vòng đời dữ liệu

Product đi từ draft, review nội dung, active/public, hidden hoặc discontinued. Order item sẽ giữ snapshot để không bị ảnh hưởng khi product đổi.

## Data Ownership / Sở hữu dữ liệu

Product domain sở hữu dữ liệu sản phẩm. Category, Brand và Media sở hữu dữ liệu gốc của phân loại, thương hiệu và file.

## Data Validation / Validation dữ liệu

- `product_code` và `slug` unique theo tenant.
- `base_price` không âm.
- `display_order` không âm và ổn định trong danh sách.
- `allergy_warning` phải rõ nếu ingredient có rủi ro dị ứng.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `product_code` | `products` | Mã sản phẩm nội bộ. | Unique theo tenant. |
| `slug` | `products` | Đường dẫn SEO logic. | Unique theo tenant, không trùng product active. |
| `base_price` | `products` | Giá nền trước promotion. | Không âm. |
| `sellable_status` | `products` | Khả năng bán. | sellable, out_of_stock, preorder, unavailable. |
| `allergy_warning` | `product_ingredients` | Cảnh báo dị ứng. | Bắt buộc khi thành phần có rủi ro. |
