# Cache Guideline / Hướng dẫn cache

## Purpose / Mục tiêu

Cache giúp giảm tải database, tăng tốc response và cải thiện trải nghiệm người dùng. Cache phải có chiến lược rõ để tránh hiển thị dữ liệu cũ hoặc sai.

## Cache Candidates / Dữ liệu nên cân nhắc cache

- Danh mục sản phẩm ít thay đổi.
- Metadata public.
- FAQ và knowledge public.
- Kết quả tìm kiếm phổ biến nếu có invalidation hợp lý.
- AI output ổn định, không nhạy cảm và có version context.

## Cache Rule / Quy tắc cache

- Mỗi cache phải có key convention.
- Mỗi cache phải có TTL hoặc invalidation rule.
- Không cache dữ liệu cá nhân nhạy cảm nếu chưa có policy.
- Khi dữ liệu nguồn thay đổi, phải xác định cách làm mới cache.

## Related / Liên quan

- [Performance Guideline / Hướng dẫn hiệu năng](performance-guideline.md)
- [Security Guideline / Hướng dẫn bảo mật](../security/security-guideline.md)

