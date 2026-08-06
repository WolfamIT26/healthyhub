# Deployment / Triển khai

## Environments / Môi trường

- Local development.
- Staging.
- Production.

## Docker / Container

Docker được dùng để chuẩn hóa môi trường database và các dịch vụ phụ trợ. Khi triển khai app thực tế, cần bổ sung Dockerfile cho web và api.

## Environment Variables / Biến môi trường

- Không commit `.env`.
- Chỉ commit `.env.example`.
- Secret production phải quản lý bằng secret manager hoặc cấu hình bảo mật tương đương.

## Release Rule / Quy tắc release

Trước release phải hoàn tất:

- Test pass.
- Security checklist.
- Performance checklist nếu có luồng chịu tải.
- Documentation update.
- ChangeLog update.

