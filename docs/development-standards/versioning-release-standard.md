# Versioning Release Standard / Chuẩn version và release

## Purpose / Mục tiêu

Versioning và release giúp HealthyHub phát hành có kiểm soát, có changelog, có rollback guideline và không bỏ sót tài liệu.

## Versioning Rule / Quy tắc version

- Dùng semantic versioning khi bắt đầu release chính thức.
- Version contract/API cần backward compatibility hoặc deprecation strategy.
- Breaking change phải có decision và migration/communication plan.

## Release Checklist / Checklist release

- Specification liên quan đã cập nhật.
- OpenAPI/Swagger/API collection đã cập nhật nếu có API.
- Database migration đã review nếu có thay đổi schema.
- Lint, test và build đạt.
- Security review đạt.
- Performance review đạt với luồng chính.
- Documentation, Status, Report, Checklist, ChangeLog đã cập nhật.
- Rollback hoặc restore guideline rõ nếu có rủi ro dữ liệu.

## Release Notes / Ghi chú phát hành

Release notes phải nêu tính năng mới, sửa lỗi, thay đổi breaking nếu có, migration cần chạy, rủi ro còn lại và hướng rollback.

