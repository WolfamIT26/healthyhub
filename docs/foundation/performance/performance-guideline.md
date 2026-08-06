# Performance Guideline / Hướng dẫn hiệu năng

## Principle / Nguyên tắc

Hiệu năng phải được thiết kế từ đầu nhưng tối ưu sâu chỉ thực hiện khi có dữ liệu đo. HealthyHub ưu tiên phản hồi nhanh, query có index, phân trang rõ, tải ảnh hợp lý và API tránh trả dữ liệu thừa.

## Performance Areas / Khu vực hiệu năng

- Database index và query optimization.
- Pagination cho danh sách lớn.
- Cache cho dữ liệu đọc nhiều.
- Image optimization cho sản phẩm và banner.
- API response size và latency.
- Frontend bundle size và rendering.
- AI request timeout, retry và fallback.

## Measurement Rule / Quy tắc đo lường

Không kết luận hiệu năng dựa trên cảm giác. Khi có code, cần đo latency, throughput, slow query, bundle size, memory và error rate theo môi trường phù hợp.

## Related / Liên quan

- [Monitoring Strategy / Chiến lược monitoring](../deployment/monitoring-strategy.md)
- [Database Optimization Guideline / Tối ưu database](database-optimization-guideline.md)

