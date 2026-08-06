# Payment Physical Database / Database vật lý domain thanh toán

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `payments` | Thanh toán theo order. |
| `payment_attempts` | Lần thử/xác nhận thanh toán. |
| `refund_requests` | Yêu cầu hoàn tiền. |
| `payment_status_histories` | Lịch sử trạng thái thanh toán. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `payments` | `order_id` | `BIGINT UNSIGNED` | No | None | FK Order. |
| `payments` | `payment_method` | `VARCHAR(64)` | No | `cod` | cod/bank_transfer/online future. |
| `payments` | `payment_amount` | `DECIMAL(12,2)` | No | `0.00` | Money. |
| `payments` | `payment_status` | `VARCHAR(32)` | No | `pending` | pending/confirmed/failed/cancelled/refunded. |
| `payments` | `paid_at` | `DATETIME(3)` | Yes | `NULL` | Paid marker. |
| `payments` | `provider_reference` | `VARCHAR(191)` | Yes | `NULL` | Không secret. |
| `payment_attempts` | `payment_id` | `BIGINT UNSIGNED` | No | None | FK Payment. |
| `payment_attempts` | `attempt_status` | `VARCHAR(32)` | No | `pending` | pending/success/failed. |
| `payment_attempts` | `failure_reason` | `VARCHAR(500)` | Yes | `NULL` | Required when failed. |
| `payment_attempts` | `attempted_at` | `DATETIME(3)` | No | Current time | Attempt time. |
| `payment_attempts` | `provider_response_reference` | `VARCHAR(191)` | Yes | `NULL` | Reference only. |
| `refund_requests` | `payment_id` | `BIGINT UNSIGNED` | No | None | FK Payment. |
| `refund_requests` | `refund_amount` | `DECIMAL(12,2)` | No | None | Money. |
| `refund_requests` | `refund_reason` | `VARCHAR(500)` | No | None | Required. |
| `refund_requests` | `refund_status` | `VARCHAR(32)` | No | `requested` | requested/approved/rejected/completed. |
| `refund_requests` | `requested_at` | `DATETIME(3)` | No | Current time | Request time. |
| `refund_requests` | `completed_at` | `DATETIME(3)` | Yes | `NULL` | Complete time. |
| `refund_requests` | `requested_by` | `BIGINT UNSIGNED` | Yes | `NULL` | FK User. |
| `payment_status_histories` | `payment_id` | `BIGINT UNSIGNED` | No | None | FK Payment. |
| `payment_status_histories` | `from_status` | `VARCHAR(32)` | Yes | `NULL` | Previous. |
| `payment_status_histories` | `to_status` | `VARCHAR(32)` | No | None | New. |
| `payment_status_histories` | `reason` | `VARCHAR(500)` | Yes | `NULL` | Reason. |
| `payment_status_histories` | `changed_at` | `DATETIME(3)` | No | Current time | Audit. |
| `payment_status_histories` | `changed_by` | `BIGINT UNSIGNED` | Yes | `NULL` | FK User. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `payments` | `id` | `order_id` | One primary payment per order by migration rule | amount >= 0 | `idx_payments_order_status`, `idx_payments_status_time`, `idx_payments_provider_ref` |
| `payment_attempts` | `id` | `payment_id` | None | failure reason required when failed | `idx_payment_attempts_payment_time`, `idx_payment_attempts_status_time` |
| `refund_requests` | `id` | `payment_id`, `requested_by` | None | refund_amount > 0 | `idx_refund_requests_payment_status`, `idx_refund_requests_status_time` |
| `payment_status_histories` | `id` | `payment_id`, `changed_by` | None | `to_status` allowed | `idx_payment_status_payment_time` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: Không dùng.
- Generated Column: Không dùng.

## FK Delete Rule / Quy tắc xóa FK

- Order -> payment: Restrict; payment không hard delete.
- Payment -> attempt/refund/history: Restrict.
- Actor FKs: Set Null.

## Performance & Retention / Hiệu năng và lưu giữ

- Payment query theo order/status/provider reference.
- Payment history và attempts có thể archive theo retention nhưng không phá audit order.
