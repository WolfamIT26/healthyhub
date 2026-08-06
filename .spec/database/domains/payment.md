# Payment Database / Database domain thanh toán

## Storage Purpose / Mục đích lưu trữ

Lưu trạng thái thanh toán, lần thử thanh toán, yêu cầu hoàn tiền và lịch sử trạng thái để theo dõi payment ở mức nghiệp vụ.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `payments` | Bản ghi thanh toán chính theo order. |
| `payment_attempts` | Lần thử thanh toán hoặc xác nhận thủ công. |
| `refund_requests` | Yêu cầu hoàn tiền/điều chỉnh. |
| `payment_status_histories` | Lịch sử thay đổi trạng thái payment. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `payments` | `id` | `tenant_id`, `payment_method`, `payment_amount`, `payment_status`, `paid_at`, `provider_reference` | `order_id` -> Order | pending, confirmed, failed, cancelled, refunded |
| `payment_attempts` | `id` | `tenant_id`, `attempt_status`, `failure_reason`, `attempted_at`, `provider_response_reference` | `payment_id` | pending, success, failed |
| `refund_requests` | `id` | `tenant_id`, `refund_amount`, `refund_reason`, `refund_status`, `requested_at`, `completed_at` | `payment_id`, `requested_by` -> User | requested, approved, rejected, completed |
| `payment_status_histories` | `id` | `tenant_id`, `from_status`, `to_status`, `reason`, `changed_at` | `payment_id`, `changed_by` -> User nullable | recorded |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Một order có thể có một payment chính ở MVP.
- 1-N: Một order có thể có nhiều payment khi hỗ trợ nhiều phương thức; một payment có nhiều attempt/history/refund request.
- N-N: Không có N-N trực tiếp.
- Cardinality: Payment amount không được vượt order payable amount nếu không có adjustment policy.

## Business Constraints / Ràng buộc nghiệp vụ

- Không đánh dấu paid nếu chưa đủ điều kiện xác nhận.
- Online payment tương lai phải qua Payment Gateway.
- Refund/adjustment cần quyền phù hợp và audit.
- Không lưu thông tin thẻ/credential nhạy cảm.

## Delete Strategy / Chiến lược xóa

- Payment, attempt, refund và history không hard delete trong vận hành thường ngày.
- Dùng status cancelled/failed/refunded để phản ánh lifecycle.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Refund cần `requested_by`, `approved_by` khi triển khai approval.

## Data Lifecycle / Vòng đời dữ liệu

Payment tạo khi order cần thanh toán, có attempt, confirmed/failed/cancelled, có thể refund sau khi đủ điều kiện.

## Data Ownership / Sở hữu dữ liệu

Payment domain sở hữu trạng thái và lịch sử payment. Order chỉ giữ snapshot trạng thái payment.

## Data Validation / Validation dữ liệu

- `payment_amount` không âm và khớp order payable logic.
- `provider_reference` không chứa secret.
- Refund amount không vượt payment confirmed amount.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `payment_method` | `payments` | Phương thức thanh toán. | COD, bank_transfer, online future. |
| `payment_status` | `payments` | Trạng thái thanh toán. | pending, confirmed, failed, cancelled, refunded. |
| `provider_reference` | `payments` | Mã tham chiếu provider. | Không lưu credential. |
| `refund_amount` | `refund_requests` | Số tiền hoàn. | Không âm, không vượt payment. |
| `failure_reason` | `payment_attempts` | Lý do thất bại. | Bắt buộc khi failed. |
