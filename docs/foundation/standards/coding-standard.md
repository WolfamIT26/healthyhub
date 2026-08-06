# Coding Standard / Chuẩn code

## Scope / Phạm vi

Tài liệu này là chuẩn nền cho giai đoạn triển khai code sau này. Prompt 03 không tạo code, nhưng framework cần có quy tắc để AI Agent và developer áp dụng thống nhất.

## General Standard / Chuẩn chung

- TypeScript là ngôn ngữ chính cho frontend và backend.
- Ưu tiên kiểu dữ liệu rõ ràng, tránh lạm dụng `any`.
- Tên biến, hàm, class, type và interface dùng tiếng Anh.
- Code phải được chia theo module và layer, không gom logic lớn vào một file.
- Không gọi trực tiếp provider bên ngoài trong business logic.
- Không hard-code secret, URL production hoặc credential.

## Frontend Standard / Chuẩn frontend

- Component chỉ xử lý hiển thị và tương tác UI.
- Logic gọi API đặt trong service hoặc layer phù hợp.
- Text hiển thị cho người dùng dùng tiếng Việt.
- Tailwind CSS dùng có tổ chức; không tạo style rời rạc khó tái sử dụng.

## Backend Standard / Chuẩn backend

- Controller hoặc route handler chỉ xử lý request/response.
- Business rule nằm trong service hoặc use case.
- Data access nằm trong repository hoặc data layer.
- Validation thực hiện ở biên hệ thống và trước khi vào business logic.

## Documentation Standard / Chuẩn tài liệu đi kèm

Mọi thay đổi có tác động đến hành vi phải có cập nhật tài liệu tương ứng: requirement, architecture, API, database, testing hoặc changelog.

## Related / Liên quan

- [Clean Architecture / Kiến trúc sạch](../architecture/clean-architecture.md)
- [Testing Strategy / Chiến lược kiểm thử](../testing/testing-strategy.md)

