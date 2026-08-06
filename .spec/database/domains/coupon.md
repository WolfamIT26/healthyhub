# Coupon Database / Database domain mã giảm giá

## Storage Purpose / Mục đích lưu trữ

Lưu mã giảm giá, điều kiện áp dụng, lịch sử sử dụng và liên kết campaign để kiểm soát ưu đãi theo order, product, customer hoặc promotion.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `coupons` | Mã giảm giá chính. |
| `coupon_conditions` | Điều kiện áp dụng coupon. |
| `coupon_usages` | Lịch sử sử dụng coupon. |
| `coupon_campaign_links` | Liên kết coupon với promotion/campaign. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `coupons` | `id` | `tenant_id`, `coupon_code`, `discount_type`, `discount_value`, `usage_limit`, `valid_from`, `valid_to`, `coupon_status` | None | draft, active, expired, disabled |
| `coupon_conditions` | `id` | `tenant_id`, `condition_type`, `condition_value`, `condition_status` | `coupon_id` | active, inactive |
| `coupon_usages` | `id` | `tenant_id`, `coupon_code_snapshot`, `discount_applied`, `used_at`, `usage_status` | `coupon_id`, `order_id` -> Order nullable, `customer_profile_id` -> Customer nullable | reserved, used, reverted |
| `coupon_campaign_links` | `id` | `tenant_id`, `link_status`, `linked_at` | `coupon_id`, `promotion_id` -> Promotion | active, inactive |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Không có 1-1 bắt buộc.
- 1-N: Một coupon có nhiều condition và usage.
- N-N: Coupon và Promotion qua `coupon_campaign_links`.
- Cardinality: Coupon code active phải unique theo tenant.

## Business Constraints / Ràng buộc nghiệp vụ

- Coupon chỉ hợp lệ khi còn thời gian, còn lượt và đủ điều kiện.
- Coupon không được làm sai chính sách giá tối thiểu.
- Coupon usage phải gắn order/customer khi phát sinh sử dụng thực tế.

## Delete Strategy / Chiến lược xóa

- Coupon dùng disabled/expired thay vì hard delete nếu đã có usage.
- Coupon usage không hard delete trong vận hành thường ngày.
- Condition có thể inactive khi coupon rule thay đổi.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Coupon cần `created_by`, `updated_by`; usage cần `used_at`.

## Data Lifecycle / Vòng đời dữ liệu

Coupon tạo ở draft, active trong thời gian hiệu lực, được reserve/use/revert theo order, rồi expired/disabled.

## Data Ownership / Sở hữu dữ liệu

Coupon domain sở hữu code, condition và usage. Promotion chỉ sở hữu campaign context.

## Data Validation / Validation dữ liệu

- `coupon_code` unique theo tenant.
- `discount_value` không âm và phù hợp `discount_type`.
- `valid_to` sau `valid_from`.
- `usage_limit` không âm nếu có giới hạn.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `coupon_code` | `coupons` | Mã khách nhập/dùng. | Unique, uppercase/English format. |
| `discount_type` | `coupons` | Loại giảm giá. | fixed, percent, shipping. |
| `discount_value` | `coupons` | Giá trị giảm. | Không âm. |
| `condition_type` | `coupon_conditions` | Loại điều kiện. | order_total, product, customer_segment, first_order. |
| `usage_status` | `coupon_usages` | Trạng thái sử dụng. | reserved, used, reverted. |
