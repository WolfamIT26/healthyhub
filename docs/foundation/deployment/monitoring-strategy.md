# Monitoring Strategy / Chiến lược monitoring

## Purpose / Mục tiêu

Monitoring giúp phát hiện lỗi, suy giảm hiệu năng, sự cố bảo mật và hành vi AI bất thường. HealthyHub cần log và metric đủ để vận hành sản phẩm thương mại.

## Monitoring Areas / Khu vực theo dõi

- Application health.
- API latency và error rate.
- Database slow query.
- Authentication failures.
- Payment và order flow khi triển khai.
- AI request count, latency, error và safety flag.
- Storage upload/download error.

## Alert Rule / Quy tắc cảnh báo

Alert phải có ngưỡng rõ, người nhận rõ và hành động xử lý đầu tiên. Không tạo quá nhiều alert gây nhiễu; ưu tiên sự cố ảnh hưởng người dùng, dữ liệu, thanh toán và bảo mật.

## Related / Liên quan

- [Performance Guideline / Hướng dẫn hiệu năng](../performance/performance-guideline.md)
- [Security Guideline / Hướng dẫn bảo mật](../security/security-guideline.md)

