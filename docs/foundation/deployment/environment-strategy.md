# Environment Strategy / Chiến lược môi trường

## Purpose / Mục tiêu

Environment Strategy đảm bảo mỗi môi trường có cấu hình, dữ liệu, log và secret tách biệt. Điều này giảm rủi ro dùng nhầm dữ liệu thật khi phát triển hoặc test.

## Separation Rule / Quy tắc tách môi trường

- Development không dùng database production.
- Test có thể reset dữ liệu tự động.
- Staging mô phỏng production nhưng không dùng dữ liệu nhạy cảm thật nếu chưa ẩn danh.
- Production chỉ nhận thay đổi đã qua review và release gate.

## Configuration Files / File cấu hình

- `.env.example`: danh sách biến chung.
- `.env.development.example`: mẫu cho local development.
- `.env.test.example`: mẫu cho kiểm thử.
- `.env.production.example`: mẫu biến production, không chứa secret thật.

## Related / Liên quan

- [Environment Guideline / Hướng dẫn môi trường](../security/environment-guideline.md)
- [Deployment Strategy / Chiến lược triển khai](deployment-strategy.md)

