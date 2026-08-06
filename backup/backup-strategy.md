# Backup Strategy / Chiến lược sao lưu

## Scope / Phạm vi

Sao lưu cần bao gồm:

- Database.
- Product images.
- User uploaded documents.
- AI uploaded files nếu có.
- Configuration template, không bao gồm secret thật.

## Frequency / Tần suất

- Development: sao lưu thủ công khi cần.
- Staging: sao lưu trước migration hoặc test lớn.
- Production daily backup: xem `daily-backup.md`.
- Production weekly backup: xem `weekly-backup.md`.
- Production monthly backup: xem `monthly-backup.md`.

## Retention / Thời gian lưu

Retention production phải được quyết định trước release thật, dựa trên yêu cầu pháp lý, chi phí và khả năng khôi phục.

## Security / Bảo mật

Backup chứa dữ liệu thật phải được mã hóa, giới hạn quyền truy cập và không commit vào Git.

## Disaster Recovery / Khôi phục thảm họa

Kịch bản sự cố lớn được mô tả trong `disaster-recovery.md`.

## Restore / Khôi phục

Quy trình restore chi tiết nằm trong `restore-guideline.md`.
