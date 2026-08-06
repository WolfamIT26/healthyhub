# Performance Strategy / Chiến lược hiệu năng Database

## Index Strategy / Chiến lược index

- Mọi FK quan trọng cần index.
- Mọi query danh sách theo `tenant_id`, `status`, `created_at` hoặc lifecycle timestamp cần composite index theo thứ tự query.
- Slug, code và identifier dùng unique index theo `tenant_id`.
- Search sản phẩm/blog/review có thể dùng full text index ở MySQL nếu chưa có search engine riêng.
- Không index mọi column; index phải phục vụ query hoặc constraint cụ thể.

## Common Composite Index / Composite index phổ biến

| Pattern / Mẫu | Use Case / Trường hợp |
| --- | --- |
| `(tenant_id, status, created_at)` | Danh sách admin theo trạng thái và thời gian. |
| `(tenant_id, slug)` | Tìm public content bằng slug. |
| `(tenant_id, code)` | Tìm mã sản phẩm, mã đơn, coupon. |
| `(tenant_id, customer_profile_id, created_at)` | Lịch sử đơn/giỏ/loyalty của khách. |
| `(tenant_id, product_id, created_at)` | Review, inventory history, order item analytics. |
| `(tenant_id, source_domain, source_reference_id)` | AI, analytics, media usage, staff activity. |

## Query Optimization Guideline / Hướng dẫn tối ưu query

- Danh sách lớn phải phân trang.
- Không dùng query lấy toàn bộ field khi API chỉ cần subset.
- Tránh N+1 bằng cách xác định query read model ở API Specification.
- Query dashboard/analytics nên đọc snapshot thay vì scan bảng giao dịch lớn.
- Text search public cần full text hoặc search service tương lai; không dùng filter `LIKE` rộng trên bảng lớn trong production.

## Partition Recommendation / Khuyến nghị partition

Partition chưa bắt buộc ở MVP. Cân nhắc theo thời gian khi các bảng sau tăng lớn:

- `login_attempts`.
- `staff_activities`.
- `order_status_histories`.
- `payment_status_histories`.
- `shipping_status_histories`.
- `notification_delivery_statuses`.
- `ai_interactions`.
- `metric_snapshots`.

Partition key đề xuất là timestamp nghiệp vụ như `created_at`, `attempted_at`, `changed_at`, `requested_at` hoặc `period_start`.

## Archive Strategy / Chiến lược archive

- Dữ liệu giao dịch giữ online theo policy vận hành, sau đó archive sang storage/bảng lịch sử ở giai đoạn scale.
- Bảng log/audit/AI interaction có retention riêng để giảm chi phí và rủi ro privacy.
- Archive không được phá vỡ khả năng audit order/payment/shipping quan trọng.

## Data Retention / Lưu giữ dữ liệu

| Data Group / Nhóm dữ liệu | Retention Guidance / Hướng dẫn |
| --- | --- |
| Order/payment/shipping | Giữ dài hạn theo nhu cầu kế toán/vận hành. |
| Customer profile | Giữ khi còn order/loyalty, xử lý privacy request theo policy. |
| Login/security log | Giữ theo security policy, có thể archive. |
| AI interaction | Giữ có giới hạn, anonymize nếu chứa dữ liệu cá nhân. |
| Notification delivery | Giữ theo nhu cầu audit gửi thông báo. |
| Analytics snapshot | Giữ dài hạn dạng tổng hợp, giảm dữ liệu cá nhân. |
