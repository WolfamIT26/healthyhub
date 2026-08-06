# Backup Strategy / Chiến lược sao lưu

## Purpose / Mục tiêu

Backup bảo vệ dữ liệu database, file upload, tài liệu và cấu hình quan trọng. Backup phải đi cùng restore guideline, vì backup không có giá trị nếu không khôi phục được.

## Backup Types / Loại sao lưu

- Daily backup: bảo vệ dữ liệu thay đổi hằng ngày.
- Weekly backup: mốc ổn định theo tuần.
- Monthly backup: lưu dài hạn cho kiểm tra và tuân thủ.
- Pre-release backup: thực hiện trước migration hoặc release có rủi ro dữ liệu.

## Restore Rule / Quy tắc khôi phục

- Restore phải được kiểm tra định kỳ trên môi trường không phải production.
- Phải ghi thời điểm backup, phạm vi dữ liệu và người thực hiện.
- Phải có quy trình khôi phục database và file upload.
- Disaster recovery phải nêu thứ tự ưu tiên dịch vụ.

## Related / Liên quan

- [Database Optimization Guideline / Tối ưu database](../performance/database-optimization-guideline.md)
- [Release Strategy / Chiến lược release](../standards/release-strategy.md)

