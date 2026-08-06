# Backup Recovery / Sao lưu và khôi phục Database

## Purpose / Mục tiêu

Tài liệu này định nghĩa chiến lược backup, restore và disaster recovery cho database HealthyHub ở mức chuẩn bị physical design.

## Backup Strategy / Chiến lược backup

| Backup Type / Loại backup | Frequency / Tần suất | Purpose / Mục đích |
| --- | --- | --- |
| Daily backup | Hằng ngày | Bảo vệ dữ liệu giao dịch thay đổi thường xuyên. |
| Weekly backup | Hằng tuần | Mốc phục hồi ổn định theo tuần. |
| Monthly backup | Hằng tháng | Lưu dài hạn, phục vụ audit/tuân thủ. |
| Pre-release backup | Trước migration/release rủi ro | Cho phép rollback dữ liệu khi release lỗi. |

## Restore Strategy / Chiến lược restore

- Restore phải được kiểm thử định kỳ ở môi trường không phải production.
- Restore cần kiểm tra database, media reference và cấu hình liên quan.
- Mỗi bản backup phải ghi thời điểm, môi trường, phạm vi dữ liệu và người thực hiện.
- Restore production phải có người phê duyệt và log sự kiện.

## Disaster Recovery Guideline / Hướng dẫn khôi phục thảm họa

Thứ tự ưu tiên khôi phục:

1. Database phục vụ xem sản phẩm và đặt hàng.
2. Order, payment, shipping và inventory.
3. Customer và authentication.
4. Media public quan trọng.
5. Notification, analytics và AI logs.

## Retention & Privacy / Lưu giữ và riêng tư

- Backup chứa dữ liệu cá nhân phải được bảo vệ như production data.
- Backup cũ cần lifecycle rõ, không giữ vô hạn nếu không có lý do.
- AI interaction và analytics có thể cần anonymize/purge theo policy.

## Recovery Validation / Kiểm tra sau khôi phục

- Kiểm tra số lượng bảng chính.
- Kiểm tra sample order/payment/shipping.
- Kiểm tra đăng nhập admin.
- Kiểm tra product public và media reference.
- Kiểm tra quyền không bị mở rộng sai.
