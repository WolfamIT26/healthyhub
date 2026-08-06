# Release Strategy / Chiến lược release

## Purpose / Mục tiêu

Release Strategy giúp mỗi lần phát hành có kiểm soát, có changelog, có checklist, có rollback plan và có tài liệu vận hành.

## Release Inputs / Đầu vào release

- Version hoặc milestone đã xác định.
- Danh sách thay đổi đã review.
- Test result đạt yêu cầu.
- Tài liệu đã cập nhật.
- Migration và backup plan nếu có thay đổi dữ liệu.
- Security review cho thay đổi nhạy cảm.

## Release Output / Đầu ra release

- Release notes.
- Release checklist.
- Version history.
- Deployment record.
- Known issues nếu còn tồn tại.

## Release Rule / Quy tắc release

Không release nếu chưa có cách rollback hoặc khôi phục dữ liệu cho thay đổi có rủi ro. Với thay đổi AI, phải có log, review checklist và cách tắt tính năng nếu output không đạt chất lượng.

## Related / Liên quan

- [Deployment Strategy / Chiến lược triển khai](../deployment/deployment-strategy.md)
- [Backup Strategy / Chiến lược sao lưu](../deployment/backup-strategy.md)

