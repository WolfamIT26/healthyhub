# Environment Standard / Chuẩn môi trường

## Purpose / Mục tiêu

Environment Standard quy định cách tách cấu hình local, development, test và production. Không lưu secret thật trong repository.

## Environment Files / File môi trường

| File / File | Purpose / Mục tiêu |
| --- | --- |
| `.env.example` | Mẫu biến môi trường chung. |
| `.env.development.example` | Mẫu biến development. |
| `.env.test.example` | Mẫu biến test. |
| `.env.production.example` | Mẫu biến production, không chứa secret thật. |

## Configuration Rule / Quy tắc cấu hình

- Không hardcode URL, port, secret, role hoặc provider config trong code.
- Biến môi trường mới phải có mô tả trong example file hoặc documentation liên quan.
- Production secret phải quản lý bằng hệ thống ngoài repository.
- Không in toàn bộ environment ra log.

## Environment Separation / Tách môi trường

- Development dùng dữ liệu local/dev.
- Test dùng database/config riêng.
- Production không dùng seed/dev credential.
- AI/payment/storage provider config phải tách theo môi trường.

## Failure Rule / Quy tắc lỗi cấu hình

Ứng dụng phải fail rõ ràng khi thiếu config bắt buộc ở phase implementation, nhưng message không được lộ secret.

## Implementation Foundation Mapping / Mapping nền tảng triển khai

Tài liệu môi trường runtime của Prompt 14 nằm tại [Implementation Environment Guide](../implementation-foundation/environment-guide.md).
