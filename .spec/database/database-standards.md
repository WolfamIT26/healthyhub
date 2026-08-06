# Database Standards / Chuẩn Database Logical

## Purpose / Mục tiêu

Tài liệu này chuẩn hóa cách đặt tên, định danh, timestamp, enum và lookup cho Logical Database Model của HealthyHub.

## Naming Convention / Quy ước đặt tên

| Object / Đối tượng | Convention / Quy ước | Example / Ví dụ |
| --- | --- | --- |
| Logical entity | `snake_case` số nhiều | `products`, `orders`, `customer_profiles` |
| Primary key | `id` | `id` |
| Foreign key | `<entity_singular>_id` | `product_id`, `customer_profile_id` |
| Tenant key | `tenant_id` | Dùng cho multi-tenant trong tương lai |
| Status field | `<entity>_status` hoặc `status` | `order_status`, `payment_status`, `status` |
| Audit field | `created_at`, `updated_at`, `created_by`, `updated_by` | Dùng thống nhất mọi entity vận hành |
| Soft delete field | `deleted_at`, `deleted_by`, `delete_reason` | Dùng khi dữ liệu cần phục hồi hoặc audit |

## ID Strategy / Chiến lược ID

- Mọi logical entity chính có `id` làm PK.
- `tenant_id` được chuẩn bị ở entity vận hành để hỗ trợ multi-tenant/SaaS sau này.
- ID vật lý cụ thể sẽ quyết định ở Physical Database Design.
- Entity history/audit có thể dùng `id` riêng để truy vết sự kiện.
- Không dùng thông tin nhạy cảm như email, số điện thoại hoặc mã đơn làm PK.

## Timestamp Strategy / Chiến lược thời gian

- Mọi entity vận hành có `created_at` và `updated_at`.
- Entity có lifecycle quan trọng cần thêm mốc thời gian nghiệp vụ như `published_at`, `confirmed_at`, `cancelled_at`, `paid_at`, `shipped_at`.
- Timestamp lưu theo một chuẩn thời gian thống nhất ở backend; cách lưu vật lý sẽ quyết định ở bước Physical Database Design.
- Báo cáo analytics phải ghi rõ `period_start` và `period_end`.

## Enum Strategy / Chiến lược enum

- Enum dùng cho trạng thái nghiệp vụ có tập giá trị rõ như `order_status`, `payment_status`, `shipping_status`.
- Enum có khả năng thay đổi thường xuyên hoặc cần quản trị nên cân nhắc lookup table ở Physical Database Design.
- Tài liệu logical chỉ ghi tên enum và ý nghĩa, không ràng buộc kiểu dữ liệu vật lý.

## Lookup Table Strategy / Chiến lược lookup table

Lookup table phù hợp khi dữ liệu:

- Cần quản trị từ dashboard.
- Cần dịch nội dung hiển thị sang nhiều ngôn ngữ.
- Cần bật/tắt trạng thái theo tenant.
- Có thể mở rộng mà không sửa code.

Các ứng viên lookup:

- `roles`
- `permissions`
- `product_categories`
- `brand_certificates`
- `payment_methods`
- `shipping_methods`
- `notification_templates`
- `setting_definitions`

## Audit Fields / Trường audit chuẩn

| Field / Trường | Meaning / Ý nghĩa |
| --- | --- |
| `created_at` | Thời điểm tạo bản ghi. |
| `updated_at` | Thời điểm cập nhật gần nhất. |
| `created_by` | User/staff tạo bản ghi nếu có. |
| `updated_by` | User/staff cập nhật gần nhất nếu có. |
| `deleted_at` | Thời điểm soft delete nếu áp dụng. |
| `deleted_by` | Người thực hiện soft delete nếu áp dụng. |
| `version` | Số phiên bản logic để hỗ trợ optimistic update hoặc audit sau này. |

## Logical Relationship Rule / Quy tắc quan hệ logic

- Quan hệ phải đi theo ownership domain.
- Cross-domain reference chỉ lưu khóa tham chiếu logic, không cho domain này sở hữu dữ liệu của domain khác.
- Quan hệ N-N dùng association entity có ownership rõ.
- Không tạo foreign key đến dữ liệu provider bên ngoài; chỉ lưu provider reference ở gateway/logical entity liên quan.

## Multi Tenant Rule / Quy tắc multi-tenant

- Các dữ liệu thuộc cửa hàng cần chuẩn bị `tenant_id`.
- Dữ liệu nền tảng dùng chung có thể không gắn tenant nếu là global configuration.
- SaaS chưa triển khai ở Prompt 08, nhưng logical model phải không khóa cứng vào một cửa hàng duy nhất.
