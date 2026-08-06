# Gateway Architecture / Kiến trúc Gateway

## Purpose / Mục tiêu

Gateway Layer cô lập hệ thống khỏi provider bên ngoài. Business Layer không phụ thuộc trực tiếp SDK hoặc API của provider.

## Planned Gateways / Gateway dự kiến

- AI Gateway: gọi provider AI, quản lý prompt, model, token, fallback.
- Payment Gateway: thanh toán, refund, webhook.
- Storage Gateway: upload, download, signed URL.
- Notification Gateway: email, SMS, push notification.
- OCR Gateway: đọc text từ ảnh hoặc tài liệu.
- Vision Gateway: nhận diện ảnh sản phẩm, món ăn, QR.
- Analytics Gateway: gửi event và đọc dữ liệu phân tích.
- Integration Gateway: tích hợp ERP, CRM, marketplace hoặc đối tác.

## Contract Rule / Quy tắc contract

Mỗi gateway phải có interface rõ, tài liệu input/output, lỗi dự kiến, retry policy và security rule.

