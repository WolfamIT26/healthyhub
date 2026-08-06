# Dependency Management / Quản lý dependency

## Purpose / Mục tiêu

Dependency Management kiểm soát việc thêm package để giữ stack ổn định, bảo mật và dễ bảo trì.

## Add Dependency Rule / Quy tắc thêm dependency

- Không thêm framework chính mới nếu chưa có ADR/Decision.
- Kiểm tra dependency hiện tại trước khi thêm mới.
- Chỉ thêm package khi giải quyết nhu cầu thực tế và lợi ích rõ hơn tự triển khai.
- Kiểm tra license, maintenance, security và bundle/runtime impact.
- Cập nhật package/config/documentation liên quan khi thêm dependency.

## Frontend Dependency / Dependency frontend

- Không thêm UI framework mới nếu Design System tự chủ được.
- Icon library phải được duyệt trước khi dùng rộng.
- Package nặng cần đánh giá bundle impact.

## Backend Dependency / Dependency backend

- Không gọi provider SDK trực tiếp từ business module.
- Provider SDK nếu cần phải nằm sau gateway adapter.
- Auth, validation, logging, ORM/database package phải phù hợp NestJS stack đã khóa.

## Audit Rule / Quy tắc audit

Khi có dependency mới, report phải ghi lý do, lựa chọn thay thế đã cân nhắc, rủi ro license/security và test đã chạy.

