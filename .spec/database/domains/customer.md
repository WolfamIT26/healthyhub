# Customer Database / Database domain khách hàng

## Storage Purpose / Mục đích lưu trữ

Lưu hồ sơ khách hàng, địa chỉ, phân nhóm và ghi chú chăm sóc để hỗ trợ mua hàng, loyalty, marketing có consent và chăm sóc khách.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `customer_profiles` | Hồ sơ khách hàng. |
| `customer_addresses` | Địa chỉ nhận hàng/lưu trữ của khách. |
| `customer_segments` | Phân nhóm khách theo nghiệp vụ. |
| `support_notes` | Ghi chú chăm sóc khách bởi staff. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `customer_profiles` | `id` | `tenant_id`, `customer_code`, `full_name`, `contact_info`, `customer_status`, `consent_state`, `marketing_opt_in_status` | `user_account_id` -> User nullable | active, guest, blocked, archived |
| `customer_addresses` | `id` | `tenant_id`, `recipient_name`, `phone`, `address_text`, `is_default`, `address_status` | `customer_profile_id` | active, inactive, archived |
| `customer_segments` | `id` | `tenant_id`, `segment_type`, `segment_name`, `segment_rule`, `segment_status` | `customer_profile_id` nullable | active, inactive |
| `support_notes` | `id` | `tenant_id`, `note_content`, `note_type`, `visibility_scope`, `noted_at` | `customer_profile_id`, `staff_profile_id` -> Staff | active, hidden |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Một `customer_profile` có thể gắn 0-1 `user_account`.
- 1-N: Một customer có nhiều address và support note.
- N-N: Customer và segment có thể mở rộng thành N-N nếu segment quản lý độc lập ở Phase sau.
- Cardinality: Guest checkout có thể tạo customer profile chưa có user account.

## Business Constraints / Ràng buộc nghiệp vụ

- Khách chỉ xem dữ liệu của chính mình.
- Staff chỉ xem dữ liệu cần thiết cho vận hành.
- Marketing và AI chỉ dùng dữ liệu customer khi có policy/consent phù hợp.

## Delete Strategy / Chiến lược xóa

- Customer dùng soft delete/archive nếu còn order, loyalty hoặc audit.
- Address có thể archived; hard delete chỉ khi chưa dùng trong order.
- Support note không hard delete trong vận hành thường ngày.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Support note cần `created_by` là staff/user thực hiện.

## Data Lifecycle / Vòng đời dữ liệu

Customer bắt đầu từ guest hoặc registered, có thể thành member/VIP qua Loyalty, bị blocked nếu vi phạm hoặc archived theo chính sách retention.

## Data Ownership / Sở hữu dữ liệu

Customer domain sở hữu hồ sơ và consent. Order giữ snapshot thông tin khách/địa chỉ khi đặt hàng.

## Data Validation / Validation dữ liệu

- `customer_code` unique theo tenant.
- Địa chỉ default chỉ nên có một bản active cho mỗi customer.
- `marketing_opt_in_status` phải được tôn trọng khi gửi notification marketing.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `customer_code` | `customer_profiles` | Mã khách hàng nghiệp vụ. | Unique theo tenant. |
| `contact_info` | `customer_profiles` | Email/phone liên hệ. | Bảo vệ privacy. |
| `consent_state` | `customer_profiles` | Trạng thái đồng ý dùng dữ liệu. | Bắt buộc cho AI/marketing. |
| `address_text` | `customer_addresses` | Địa chỉ giao hàng. | Đủ thông tin giao hàng. |
| `visibility_scope` | `support_notes` | Phạm vi xem ghi chú. | Staff/manager/admin theo quyền. |
