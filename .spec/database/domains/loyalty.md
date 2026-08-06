# Loyalty Database / Database domain thành viên

## Storage Purpose / Mục đích lưu trữ

Lưu tài khoản loyalty, giao dịch điểm, hạng thành viên và tiêu chí VIP để tăng giữ chân khách và kiểm soát ưu đãi.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `loyalty_accounts` | Tài khoản điểm của customer. |
| `loyalty_transactions` | Lịch sử cộng/trừ/điều chỉnh điểm. |
| `membership_tiers` | Hạng thành viên. |
| `vip_qualifications` | Tiêu chí và kết quả đạt VIP. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `loyalty_accounts` | `id` | `tenant_id`, `point_balance`, `tier_level`, `loyalty_status`, `joined_at` | `customer_profile_id` -> Customer, `membership_tier_id` nullable | active, suspended, closed |
| `loyalty_transactions` | `id` | `tenant_id`, `point_delta`, `transaction_type`, `transaction_reason`, `occurred_at` | `loyalty_account_id`, `order_id` -> Order nullable | pending, confirmed, reversed |
| `membership_tiers` | `id` | `tenant_id`, `tier_code`, `tier_level`, `tier_rule`, `benefit`, `tier_status` | None | active, inactive |
| `vip_qualifications` | `id` | `tenant_id`, `qualification_period`, `qualification_status`, `evaluated_at` | `loyalty_account_id`, `membership_tier_id` | qualified, not_qualified, expired |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Một customer có tối đa một loyalty account active theo tenant.
- 1-N: Một loyalty account có nhiều transaction và qualification.
- N-N: Customer và Membership tier có lịch sử qua qualification/transaction nếu cần.
- Cardinality: Point balance được tính từ transaction confirmed hoặc snapshot có kiểm soát.

## Business Constraints / Ràng buộc nghiệp vụ

- Điểm chỉ phát sinh từ hành vi hợp lệ.
- Hủy/hoàn đơn phải có transaction đảo hoặc điều chỉnh.
- VIP cần tiêu chí rõ và audit được.

## Delete Strategy / Chiến lược xóa

- Loyalty account dùng closed/suspended, không hard delete nếu có transaction.
- Loyalty transaction không hard delete trong vận hành thường ngày.
- Tier inactive thay vì xóa nếu đã dùng.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Transaction cần `occurred_at`, `created_by` hoặc source system.

## Data Lifecycle / Vòng đời dữ liệu

Customer tham gia loyalty, tích điểm, đổi hạng, điều chỉnh điểm khi order thay đổi, có thể suspended/closed theo policy.

## Data Ownership / Sở hữu dữ liệu

Loyalty domain sở hữu điểm và hạng. Customer sở hữu hồ sơ khách; Order cung cấp nguồn phát sinh điểm.

## Data Validation / Validation dữ liệu

- `point_delta` khác 0.
- `point_balance` không âm trừ khi policy cho phép.
- `tier_code` unique theo tenant.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `point_balance` | `loyalty_accounts` | Điểm hiện tại. | Không âm theo policy. |
| `point_delta` | `loyalty_transactions` | Điểm cộng/trừ. | Khác 0, có reason. |
| `transaction_type` | `loyalty_transactions` | Loại giao dịch điểm. | earn, redeem, adjust, reverse. |
| `tier_rule` | `membership_tiers` | Điều kiện đạt hạng. | Có thể audit. |
| `qualification_period` | `vip_qualifications` | Kỳ xét VIP. | Có start/end rõ. |
