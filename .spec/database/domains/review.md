# Review Database / Database domain đánh giá

## Storage Purpose / Mục đích lưu trữ

Lưu đánh giá sản phẩm, kiểm duyệt và báo cáo vi phạm để tăng uy tín sản phẩm và bảo vệ nội dung public.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `product_reviews` | Đánh giá sản phẩm từ khách. |
| `review_moderations` | Kết quả kiểm duyệt review. |
| `review_reports` | Báo cáo vi phạm review. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `product_reviews` | `id` | `tenant_id`, `rating`, `review_content`, `review_status`, `review_source`, `submitted_at`, `published_at` | `customer_profile_id` -> Customer, `product_id` -> Product, `order_id` -> Order nullable | pending, published, hidden, rejected |
| `review_moderations` | `id` | `tenant_id`, `moderation_status`, `moderation_reason`, `moderated_at` | `product_review_id`, `moderated_by` -> User nullable | pending, approved, rejected |
| `review_reports` | `id` | `tenant_id`, `report_reason`, `report_status`, `reported_at` | `product_review_id`, `reported_by` -> User nullable | open, reviewed, dismissed |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Một review có thể có một moderation result hiện tại.
- 1-N: Một product/customer có nhiều review; một review có nhiều report.
- N-N: Không có N-N trực tiếp.
- Cardinality: Một customer nên hạn chế số review active cho cùng product/order theo policy.

## Business Constraints / Ràng buộc nghiệp vụ

- Review nên ưu tiên khách có trải nghiệm mua hợp lệ.
- Review vi phạm policy phải hidden/rejected.
- Không chỉnh sửa review làm sai ý kiến khách hàng.

## Delete Strategy / Chiến lược xóa

- Review dùng hidden/rejected thay vì hard delete nếu đã public.
- Report và moderation giữ lịch sử audit.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Moderation cần `moderated_by`, `moderation_reason`.

## Data Lifecycle / Vòng đời dữ liệu

Review được submit, pending moderation, published hoặc hidden/rejected. Report có thể mở và được xử lý sau.

## Data Ownership / Sở hữu dữ liệu

Review domain sở hữu nội dung review và moderation. Customer/Product/Order chỉ là dữ liệu tham chiếu.

## Data Validation / Validation dữ liệu

- `rating` nằm trong thang điểm được chọn ở product policy.
- `review_content` kiểm tra độ dài và XSS khi hiển thị.
- `moderation_reason` bắt buộc khi rejected/hidden.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `rating` | `product_reviews` | Điểm đánh giá. | Trong range cho phép. |
| `review_content` | `product_reviews` | Nội dung khách viết. | Kiểm soát XSS/nội dung vi phạm. |
| `review_source` | `product_reviews` | Nguồn review. | verified_order, manual, imported future. |
| `moderation_status` | `review_moderations` | Kết quả kiểm duyệt. | pending, approved, rejected. |
| `report_reason` | `review_reports` | Lý do báo cáo. | Bắt buộc khi report. |
