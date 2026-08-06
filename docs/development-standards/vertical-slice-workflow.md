# Vertical Slice Workflow / Workflow phát triển lát cắt dọc

## Purpose / Mục tiêu

Vertical Slice Workflow giúp mỗi module được phát triển đồng bộ từ specification đến frontend, backend, database, testing và tài liệu.

## Workflow Steps / Các bước thực hiện

1. Đọc context pack.
2. Kiểm tra specification.
3. Tạo hoặc cập nhật OpenAPI liên quan nếu task cần API.
4. Tạo migration và seed nếu cần thay đổi database.
5. Tạo backend theo NestJS Modular Monolith.
6. Tạo frontend theo React feature/module.
7. Tạo test phù hợp rủi ro.
8. Review security.
9. Review performance.
10. Chạy validation, lint, test và build.
11. Cập nhật tài liệu module.
12. Khóa phiên bản module khi đạt Definition of Done.

## Slice Boundary / Ranh giới lát cắt

Một vertical slice nên hoàn thành một use case cụ thể, ví dụ quản lý sản phẩm cơ bản hoặc đặt hàng cơ bản. Không gom nhiều use case lớn nếu làm giảm khả năng review.

## Documentation Gate / Cổng tài liệu

Không chuyển sang code nếu specification chưa rõ. Không báo xong nếu API, Data Contract, UI Contract, Database Specification hoặc module docs bị lệch với code.

