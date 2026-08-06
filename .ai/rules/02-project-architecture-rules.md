# Project Architecture Rules / Quy tắc kiến trúc dự án

## Modular Monolith / Đơn khối theo module

Mỗi module phải có boundary rõ về nghiệp vụ, dữ liệu, API và UI. Không tạo phụ thuộc vòng giữa module.

## Microservice Readiness / Sẵn sàng tách microservice

Khi thiết kế module, cần ghi rõ:

- Ownership dữ liệu.
- API contract.
- Event hoặc integration point nếu có.
- Dependency với module khác.

## Layer Rule / Quy tắc phân lớp

Không để Presentation Layer gọi trực tiếp Data Layer. Không để Business Layer phụ thuộc trực tiếp provider bên ngoài.

