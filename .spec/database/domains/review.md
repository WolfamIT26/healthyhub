# Review Database / Database domain đánh giá

## Storage Purpose / Mục đích lưu trữ

Lưu đánh giá sản phẩm, kiểm duyệt và báo cáo vi phạm để tăng uy tín sản phẩm và bảo vệ nội dung public.

## Prompt 33 executable status / Trạng thái executable Prompt 33

**Review persistence READY.** Migration `1760000015000-enable-reviews-ratings-v1` creates required `order_id`, unique `(tenant_id, order_id, product_id)`, published default and soft-delete audit fields.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `product_reviews` | Đánh giá sản phẩm từ khách. |
| `review_moderations` | Future design only; not created in Prompt 33.2. |
| `review_reports` | Future design only; not created in Prompt 33.2. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `product_reviews` | `id` | `tenant_id`, `rating`, `review_content`, `review_status`, `submitted_at`, `published_at`, audit/version | `customer_profile_id` -> Customer, `product_id` -> Product, `order_id` -> Order required | published, hidden, rejected, soft-deleted |
| `review_moderations` | `id` | `tenant_id`, `moderation_status`, `moderation_reason`, `moderated_at` | `product_review_id`, `moderated_by` -> User nullable | pending, approved, rejected |
| `review_reports` | `id` | `tenant_id`, `report_reason`, `report_status`, `reported_at` | `product_review_id`, `reported_by` -> User nullable | open, reviewed, dismissed |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Một review có thể có một moderation result hiện tại.
- 1-N: Một product/customer có nhiều review; một review có nhiều report.
- N-N: Không có N-N trực tiếp.
- Cardinality: một Review cho mỗi `(tenant_id, order_id, product_id)`; lần mua fulfilled khác có identity khác.

## Business Constraints / Ràng buộc nghiệp vụ

- Review executable phải có owner-scoped active Order Item evidence và authoritative completed/delivered state/timestamps.
- Cancel/return revoke eligibility; existing review content remains public without verified-purchase evidence. Payment refund alone is not fulfillment authority.
- Review vi phạm policy phải hidden/rejected.
- Không chỉnh sửa review làm sai ý kiến khách hàng.

## Delete Strategy / Chiến lược xóa

- Review dùng hidden/rejected thay vì hard delete nếu đã public.
- Report và moderation giữ lịch sử audit.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Moderation cần `moderated_by`, `moderation_reason`.

## Data Lifecycle / Vòng đời dữ liệu

Review V1 được submit trực tiếp ở published state; owner có thể edit hoặc soft-delete. Hidden/rejected/report lifecycle cần future Admin authority.

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
| `moderation_status` | `review_moderations` | Kết quả kiểm duyệt. | pending, approved, rejected. |
| `report_reason` | `review_reports` | Lý do báo cáo. | Bắt buộc khi report. |
