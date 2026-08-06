# Database Optimization Guideline / Hướng dẫn tối ưu database

## Principle / Nguyên tắc

MySQL phải được thiết kế để query theo nhu cầu thật của feature. Không tạo index tùy tiện, nhưng mọi danh sách, filter, search và join quan trọng phải được xem xét index.

## Index Rule / Quy tắc index

- Index các field dùng thường xuyên trong `WHERE`, `JOIN`, `ORDER BY`.
- Tránh index quá nhiều field ít dùng vì làm chậm ghi dữ liệu.
- Composite index phải theo thứ tự query thực tế.
- Foreign key và field trạng thái quan trọng cần được đánh giá index.

## Query Rule / Quy tắc query

- Dùng pagination cho danh sách lớn.
- Tránh query N+1.
- Không dùng `SELECT *` trong API production nếu không cần toàn bộ field.
- Theo dõi slow query khi có môi trường chạy thật.

## Schema Change Rule / Quy tắc đổi schema

Mọi thay đổi schema phải có migration, rollback hoặc restore plan, cập nhật Database.md và kiểm tra tác động dữ liệu cũ.

## Related / Liên quan

- [Backup Strategy / Chiến lược sao lưu](../deployment/backup-strategy.md)
- [Testing Strategy / Chiến lược kiểm thử](../testing/testing-strategy.md)

