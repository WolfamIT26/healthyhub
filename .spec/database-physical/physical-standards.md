# Physical Standards / Chuẩn Database Vật lý

## Target Database / Database mục tiêu

- Database: MySQL 8.x.
- Engine: InnoDB.
- Character set: `utf8mb4`.
- Collation đề xuất: `utf8mb4_0900_ai_ci` nếu môi trường hỗ trợ; nếu không, dùng collation `utf8mb4` tương thích với MySQL hiện có.

## Integer Strategy / Chiến lược số nguyên

| Use Case / Trường hợp | Data Type / Kiểu dữ liệu | Rule / Quy tắc |
| --- | --- | --- |
| Primary key | `BIGINT UNSIGNED` | Dùng cho mọi bảng nghiệp vụ chính. |
| Foreign key | `BIGINT UNSIGNED` | Cùng kiểu với PK được tham chiếu. |
| Quantity | `INT UNSIGNED` | Dùng cho số lượng sản phẩm/tồn kho. |
| Counter nhỏ | `INT UNSIGNED` | Dùng cho attempt number, display order. |
| Version | `INT UNSIGNED` | Dùng optimistic locking, default `1`. |

## ID Strategy / Chiến lược ID

- PK mặc định là `id BIGINT UNSIGNED`.
- `id` là surrogate key nội bộ.
- Không dùng email, phone, slug hoặc mã đơn làm PK.
- UUID chưa dùng làm PK ở Prompt 09. Nếu API public cần public identifier sau này, dùng `public_id CHAR(36)` hoặc `BINARY(16)` theo ADR riêng.
- `tenant_id BIGINT UNSIGNED` có ở bảng tenant-scoped để chuẩn bị SaaS.

## VARCHAR Length Strategy / Chiến lược độ dài VARCHAR

| Field Type / Loại field | Length / Độ dài | Example / Ví dụ |
| --- | --- | --- |
| Code | `VARCHAR(64)` | `product_code`, `order_code`, `role_code` |
| Slug | `VARCHAR(191)` | `slug`, `post_slug`, `brand_slug` |
| Name/title | `VARCHAR(255)` | `product_name`, `brand_name`, `post_title` |
| Email | `VARCHAR(254)` | `email` |
| Phone | `VARCHAR(32)` | `phone`, `recipient_phone` |
| Status/type/scope | `VARCHAR(32)` hoặc `VARCHAR(64)` | `order_status`, `source_domain` |
| Provider reference | `VARCHAR(191)` | `provider_reference`, `tracking_reference` |
| Short text | `VARCHAR(500)` | `summary`, `failure_reason`, `note` |

## Text Strategy / Chiến lược TEXT

- `TEXT` dùng cho nội dung mô tả, ghi chú dài, nội dung review hoặc blog block ngắn.
- `MEDIUMTEXT` chỉ dùng cho nội dung blog hoặc AI output rất dài nếu thực tế cần.
- Không lưu secret hoặc token raw trong text column.

## Decimal Strategy / Chiến lược DECIMAL

| Use Case / Trường hợp | Data Type / Kiểu dữ liệu | Rule / Quy tắc |
| --- | --- | --- |
| Money | `DECIMAL(12,2)` | Giá, phí giao hàng, refund, discount amount. |
| Percent | `DECIMAL(5,2)` | Tỷ lệ phần trăm. |
| Confidence score | `DECIMAL(5,4)` | Giá trị 0 đến 1 nếu dùng score. |
| Metric value | `DECIMAL(18,4)` | Chỉ số analytics tổng hợp. |

## Datetime Strategy / Chiến lược DATETIME

- Dùng `DATETIME(3)` cho timestamp nghiệp vụ và audit.
- Lưu theo UTC ở backend.
- `created_at` default theo thời điểm tạo.
- `updated_at` default theo thời điểm tạo và thay đổi khi cập nhật.
- Các mốc nghiệp vụ như `paid_at`, `shipped_at`, `published_at`, `expires_at` nullable nếu chưa xảy ra.

## Boolean Strategy / Chiến lược Boolean

- Dùng `TINYINT(1)`.
- Default `0` cho trạng thái false.
- Field boolean đặt tên rõ như `is_default`, `is_primary`, `is_sensitive`, `allow_public`.

## Enum Strategy / Chiến lược Enum

- Không dùng MySQL native `ENUM` cho trạng thái nghiệp vụ dễ thay đổi.
- Dùng `VARCHAR(32)` hoặc `VARCHAR(64)` kèm check constraint ở bước migration.
- Enum cần quản trị từ dashboard thì chuyển thành lookup table ở prompt migration/seed sau.

## JSON Strategy / Chiến lược JSON

- Dùng `JSON` cho dữ liệu linh hoạt như `contact_info`, `segment_rule`, `setting_value`, `delivery_context`, `layout_reference`, `context_policy`.
- JSON không được chứa secret hoặc dữ liệu nhạy cảm không có policy.
- Field JSON thường xuyên query phải có generated column và index riêng nếu cần.

## Generated Column Strategy / Chiến lược generated column

Generated column chỉ dùng khi:

- Cần index một phần dữ liệu JSON.
- Query thật sự phổ biến.
- Có lợi rõ hơn so với chuẩn hóa thành bảng riêng.

Ứng viên:

- Email chính từ `contact_info`.
- Phone chính từ `contact_info`.
- Metric date bucket từ reporting period.

## Common Audit Columns / Cột audit dùng chung

| Column / Cột | Type / Kiểu | Nullable | Default | Note / Ghi chú |
| --- | --- | --- | --- | --- |
| `id` | `BIGINT UNSIGNED` | No | Auto generated | Primary key. |
| `tenant_id` | `BIGINT UNSIGNED` | No với bảng tenant-scoped | Theo tenant hiện tại | Chuẩn bị SaaS. |
| `created_at` | `DATETIME(3)` | No | Current timestamp | Thời điểm tạo. |
| `updated_at` | `DATETIME(3)` | No | Current timestamp | Cập nhật khi sửa. |
| `deleted_at` | `DATETIME(3)` | Yes | `NULL` | Soft delete. |
| `created_by` | `BIGINT UNSIGNED` | Yes | `NULL` | FK logic đến `user_accounts.id`. |
| `updated_by` | `BIGINT UNSIGNED` | Yes | `NULL` | FK logic đến `user_accounts.id`. |
| `deleted_by` | `BIGINT UNSIGNED` | Yes | `NULL` | FK logic đến `user_accounts.id`. |
| `version` | `INT UNSIGNED` | No | `1` | Optimistic locking nếu cần. |
