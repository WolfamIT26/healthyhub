# Promotion Database / Database domain khuyến mãi

## Storage Purpose / Mục đích lưu trữ

Lưu chương trình khuyến mãi, lịch chạy, điều kiện và đối tượng áp dụng để quản lý ưu đãi theo thời gian và chiến dịch.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `promotions` | Chương trình khuyến mãi chính. |
| `promotion_conditions` | Điều kiện áp dụng promotion. |
| `promotion_schedules` | Lịch hiệu lực theo thời gian/kênh. |
| `promotion_targets` | Đối tượng áp dụng như product/customer segment. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `promotions` | `id` | `tenant_id`, `promotion_name`, `promotion_type`, `discount_policy`, `stacking_rule`, `promotion_status`, `version` | None | draft, active, paused, ended, archived |
| `promotion_conditions` | `id` | `tenant_id`, `condition_type`, `condition_value`, `condition_status` | `promotion_id` | active, inactive |
| `promotion_schedules` | `id` | `tenant_id`, `start_at`, `end_at`, `schedule_status` | `promotion_id` | scheduled, active, expired |
| `promotion_targets` | `id` | `tenant_id`, `target_type`, `target_reference_id`, `target_status` | `promotion_id` | active, inactive |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Không có 1-1 bắt buộc.
- 1-N: Một promotion có nhiều condition, schedule và target.
- N-N: Promotion với Product/Customer segment thông qua `promotion_targets`; Promotion và Coupon qua `coupon_campaign_links`.
- Cardinality: Promotion active phải có ít nhất một schedule hợp lệ.

## Business Constraints / Ràng buộc nghiệp vụ

- Promotion phải có thời gian hiệu lực rõ.
- Khi nhiều promotion cùng áp dụng, `stacking_rule` quyết định ưu tiên/cộng dồn.
- Promotion đã chạy cần hạn chế chỉnh sửa trực tiếp, nên dùng version.

## Delete Strategy / Chiến lược xóa

- Promotion dùng paused/ended/archived nếu đã active.
- Condition/target có thể inactive thay vì xóa để giữ lịch sử.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Promotion cần `version`, `approved_by`, `approved_at` nếu quy trình duyệt được bật.

## Data Lifecycle / Vòng đời dữ liệu

Promotion tạo draft, scheduled, active, paused hoặc ended; sau đó archived khi hết dùng nhưng vẫn giữ cho báo cáo.

## Data Ownership / Sở hữu dữ liệu

Promotion domain sở hữu campaign và rule. Coupon, Product, Customer chỉ được tham chiếu qua target/link.

## Data Validation / Validation dữ liệu

- `end_at` sau `start_at`.
- `discount_policy` không vi phạm giá tối thiểu.
- `target_reference_id` phải phù hợp `target_type`.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `promotion_name` | `promotions` | Tên chương trình. | Bắt buộc. |
| `promotion_type` | `promotions` | Loại ưu đãi. | discount, bundle, shipping, voucher. |
| `stacking_rule` | `promotions` | Quy tắc cộng dồn. | exclusive, stackable, priority. |
| `target_type` | `promotion_targets` | Loại đối tượng áp dụng. | product, category, customer_segment, order. |
| `schedule_status` | `promotion_schedules` | Trạng thái lịch chạy. | scheduled, active, expired. |
