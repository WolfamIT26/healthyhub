# Deployment Strategy / Chiến lược triển khai

## Principle / Nguyên tắc

Deployment phải lặp lại được, có cấu hình theo môi trường, có backup trước thay đổi dữ liệu và có rollback plan. Không triển khai production nếu chưa có kiểm thử và tài liệu release.

## Deployment Stages / Giai đoạn triển khai

- Local: developer chạy và kiểm tra nhanh.
- Test: CI hoặc môi trường kiểm thử tự động.
- Staging: xác nhận release gần production.
- Production: phục vụ người dùng thật.

## Release Gate / Cổng trước release

Trước khi deploy phải có:

- Test result đạt yêu cầu.
- Environment variables đã xác nhận.
- Migration plan nếu có thay đổi dữ liệu.
- Backup plan cho dữ liệu quan trọng.
- Monitoring và log target.
- Rollback plan.

## Related / Liên quan

- [Release Strategy / Chiến lược release](../standards/release-strategy.md)
- [Monitoring Strategy / Chiến lược monitoring](monitoring-strategy.md)

