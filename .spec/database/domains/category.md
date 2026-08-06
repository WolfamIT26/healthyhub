# Category Database / Database domain danh mục

## Storage Purpose / Mục đích lưu trữ

Lưu danh mục sản phẩm, quy tắc hiển thị và liên kết product-category để khách dễ tìm sản phẩm theo nhóm.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `categories` | Danh mục hoặc cây danh mục sản phẩm. |
| `category_display_rules` | Quy tắc hiển thị, sort, visibility theo kênh. |
| `product_category_links` | Association giữa product và category. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `categories` | `id` | `tenant_id`, `category_name`, `slug`, `description`, `parent_category_id`, `category_status`, `category_visibility` | `parent_category_id` -> Category nullable | active, hidden, archived |
| `category_display_rules` | `id` | `tenant_id`, `display_channel`, `display_order`, `rule_status`, `effective_from`, `effective_to` | `category_id` | active, inactive, expired |
| `product_category_links` | `id` | `tenant_id`, `is_primary`, `link_status`, `linked_at` | `product_id` -> Product, `category_id` | active, inactive |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Không có quan hệ 1-1 bắt buộc.
- 1-N: Một category có nhiều child category và nhiều display rule.
- N-N: Product và Category qua `product_category_links`.
- Cardinality: Product public cần ít nhất một category active; một product chỉ nên có một category primary.

## Business Constraints / Ràng buộc nghiệp vụ

- Danh mục không trùng nghĩa gây rối tìm kiếm.
- Category hidden không nên xuất hiện ở public navigation.
- Không tạo vòng lặp parent-child category.

## Delete Strategy / Chiến lược xóa

- Category dùng hidden/archive nếu đang có product link.
- Product-category link có thể inactive thay vì hard delete để giữ lịch sử quản trị.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn cho category, display rule và link.

## Data Lifecycle / Vòng đời dữ liệu

Category tạo ở active/hidden, được gắn product, thay đổi thứ tự hiển thị, sau đó archived khi không dùng.

## Data Ownership / Sở hữu dữ liệu

Category domain sở hữu category và link phân loại. Product domain vẫn sở hữu dữ liệu product gốc.

## Data Validation / Validation dữ liệu

- `slug` unique theo tenant.
- `parent_category_id` không được trỏ chính nó.
- `display_order` không âm.
- `is_primary` chỉ một active link cho mỗi product trong scope chính.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `category_name` | `categories` | Tên danh mục hiển thị. | Bắt buộc, dễ hiểu. |
| `slug` | `categories` | Slug SEO của danh mục. | Unique theo tenant. |
| `parent_category_id` | `categories` | Danh mục cha. | Nullable, không vòng lặp. |
| `is_primary` | `product_category_links` | Danh mục chính của product. | Tối đa một active primary. |
| `display_channel` | `category_display_rules` | Kênh hiển thị. | web, mobile future, admin. |
