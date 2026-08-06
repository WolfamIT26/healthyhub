# Webhook Policy / Chính sách webhook

## Purpose / Mục tiêu

Tài liệu này chuẩn hóa webhook cho payment, shipping, notification và integration tương lai. Prompt 10 chỉ đặc tả, chưa tạo provider thật hoặc code xác thực chữ ký.

## Webhook Principle / Nguyên tắc webhook

- Webhook phải idempotent.
- Webhook phải xác thực provider bằng signature, API key hoặc cơ chế tương đương khi triển khai.
- Webhook phải ghi audit/log sự kiện.
- Webhook không được tin dữ liệu provider nếu chưa verify.
- Webhook response không lộ chi tiết nghiệp vụ nội bộ.

## Webhook Groups / Nhóm webhook

| Group / Nhóm | URI Pattern / Mẫu URI | Usage / Cách dùng |
| --- | --- | --- |
| Payment | `/api/v1/webhooks/payment/{provider}` | Nhận trạng thái thanh toán/refund từ provider. |
| Shipping | `/api/v1/webhooks/shipping/{provider}` | Nhận trạng thái giao hàng/tracking từ đơn vị vận chuyển. |
| Notification | `/api/v1/webhooks/notification/{provider}` | Nhận delivery status email/SMS/Zalo/push. |
| Integration | `/api/v1/webhooks/integrations/{provider}` | Chuẩn bị cho tích hợp tương lai. |

## Webhook Contract / Contract webhook

| Field / Thành phần | Rule / Quy tắc |
| --- | --- |
| Authentication | Provider signature hoặc API key bắt buộc khi triển khai. |
| Idempotency | Dedupe bằng provider event ID hoặc idempotency key. |
| Response | Trả accepted envelope, không trả dữ liệu nhạy cảm. |
| Error | Provider error mapping không lộ stack trace. |
| Retry | Provider có thể retry, backend phải xử lý trùng an toàn. |

## Domain Ownership / Quyền sở hữu domain

- Payment webhook chỉ cập nhật trạng thái Payment và phát event cho Order nếu hợp lệ.
- Shipping webhook chỉ cập nhật Shipping và tracking status.
- Notification webhook chỉ cập nhật delivery status.
- Integration webhook phải đi qua Integration Gateway nếu có provider ngoài.

