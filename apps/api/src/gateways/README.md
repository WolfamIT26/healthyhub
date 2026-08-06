# Gateways / Gateway Layer

## Purpose / Mục tiêu

Thư mục này chuẩn bị cấu trúc cho các gateway tích hợp bên ngoài. Chưa có implementation.

## Gateway List / Danh sách gateway

- `ai`: AI provider, prompt, model và fallback.
- `payment`: thanh toán và webhook.
- `storage`: upload, download và signed URL.
- `notification`: email, SMS và push notification.
- `ocr`: đọc text từ ảnh hoặc tài liệu.
- `vision`: nhận diện hình ảnh, QR và món ăn.
- `analytics`: event và dữ liệu phân tích.
- `integration`: tích hợp hệ thống ngoài.

## Rule / Quy tắc

Business Layer chỉ giao tiếp với provider qua gateway contract.

