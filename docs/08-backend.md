# Backend / Dịch vụ Backend

## Stack / Công nghệ

- Node.js.
- TypeScript.
- NestJS hoặc Express.js.
- MySQL.

## Architecture Rule / Quy tắc kiến trúc

Backend đi theo Modular Monolith. Mỗi module giữ ranh giới business, data access, validation và API contract rõ ràng.

## Layer Rule / Quy tắc phân lớp

- Controller hoặc route xử lý HTTP.
- Service xử lý business logic.
- Repository hoặc data access xử lý truy vấn.
- Gateway xử lý tích hợp bên ngoài.
- DTO hoặc schema xử lý validation.

## Dependency Rule / Quy tắc phụ thuộc

Module không gọi trực tiếp database của module khác nếu điều đó phá ranh giới nghiệp vụ. Cần dùng service contract hoặc query được chấp thuận.

