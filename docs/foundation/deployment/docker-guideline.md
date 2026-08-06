# Docker Guideline / Hướng dẫn Docker

## Purpose / Mục tiêu

Docker dùng để chuẩn hóa môi trường chạy web, api, database và phpMyAdmin khi dự án bắt đầu triển khai. Foundation chỉ đặt quy tắc, không tạo Dockerfile nghiệp vụ.

## Docker Rule / Quy tắc Docker

- Image build phải tái lập được.
- Không đưa secret vào image.
- Environment truyền qua biến môi trường hoặc secret mechanism.
- Container log phải đi ra stdout/stderr hoặc log target phù hợp.
- Volume phải rõ mục đích: database, upload, backup hoặc temporary.
- Healthcheck nên được bổ sung khi có service thật.

## Compose Rule / Quy tắc Docker Compose

Docker Compose dùng cho local development và môi trường kiểm thử đơn giản. Production deployment cần đánh giá riêng về network, storage, secret, scaling và monitoring.

## Related / Liên quan

- [Environment Strategy / Chiến lược môi trường](environment-strategy.md)
- [Secret Management Guideline / Quản lý secret](../security/secret-management-guideline.md)

