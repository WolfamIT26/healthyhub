# Release Management / Quản lý phát hành

## Versioning / Đánh version

Dùng Semantic Versioning khi sản phẩm bắt đầu có release thực tế.

## Release Checklist / Checklist phát hành

- Requirement đã được chốt.
- Test đã chạy.
- Security checklist đã kiểm tra.
- Performance risk đã được đánh giá.
- Documentation đã cập nhật.
- `CHANGELOG.md` đã cập nhật.

## Rollback / Quay lui

Mỗi release production cần có phương án rollback database, backend, frontend và cấu hình môi trường.

## Release Folder / Thư mục release

Release artifacts và checklist được chuẩn bị trong `releases`.

## Version History / Lịch sử phiên bản

Lịch sử phiên bản nằm tại `releases/version-history.md`.

## Release Notes / Ghi chú phát hành

Release note theo từng phiên bản sẽ đặt trong `releases/release-notes`.
