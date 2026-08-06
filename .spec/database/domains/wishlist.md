# Wishlist Database / Database domain yêu thích

## Storage Purpose / Mục đích lưu trữ

Lưu danh sách sản phẩm khách yêu thích để hỗ trợ quay lại mua, cá nhân hóa và recommendation có kiểm soát.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `wishlists` | Danh sách yêu thích của customer. |
| `wishlist_items` | Sản phẩm được lưu trong wishlist. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `wishlists` | `id` | `tenant_id`, `wishlist_name`, `wishlist_visibility`, `wishlist_status` | `customer_profile_id` -> Customer | active, archived |
| `wishlist_items` | `id` | `tenant_id`, `saved_at`, `wishlist_item_status`, `note` | `wishlist_id`, `product_id` -> Product | active, removed, unavailable |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: MVP có thể dùng một default wishlist cho một customer.
- 1-N: Một wishlist có nhiều wishlist item.
- N-N: Customer và Product liên kết qua wishlist/wishlist item.
- Cardinality: Một product không nên trùng active trong cùng wishlist.

## Business Constraints / Ràng buộc nghiệp vụ

- Wishlist là dữ liệu cá nhân, không public mặc định.
- Product bị hidden/discontinued cần thể hiện trạng thái unavailable trong wishlist.
- AI chỉ dùng wishlist cho recommendation khi có policy phù hợp.

## Delete Strategy / Chiến lược xóa

- Wishlist item có thể removed.
- Wishlist dùng archive nếu có lịch sử recommendation hoặc tracking cần giữ.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn ở mức wishlist và item.

## Data Lifecycle / Vòng đời dữ liệu

Customer tạo wishlist, thêm/xóa product, product có thể chuyển unavailable, wishlist archived khi customer không dùng.

## Data Ownership / Sở hữu dữ liệu

Wishlist domain sở hữu dữ liệu lưu sản phẩm yêu thích. Product domain sở hữu trạng thái sản phẩm.

## Data Validation / Validation dữ liệu

- `customer_profile_id` bắt buộc.
- `product_id` phải tham chiếu product tồn tại.
- Không trùng active `product_id` trong cùng wishlist.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `wishlist_name` | `wishlists` | Tên wishlist. | Có default nếu người dùng không đặt. |
| `wishlist_visibility` | `wishlists` | Mức riêng tư. | private mặc định. |
| `saved_at` | `wishlist_items` | Thời điểm lưu product. | Bắt buộc. |
| `wishlist_item_status` | `wishlist_items` | Trạng thái item. | active, removed, unavailable. |
| `note` | `wishlist_items` | Ghi chú cá nhân. | Không bắt buộc, kiểm soát XSS khi hiển thị. |
