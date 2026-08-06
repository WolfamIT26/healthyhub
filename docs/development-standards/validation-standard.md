# Validation Standard / Chuẩn validation

## Purpose / Mục tiêu

Validation bảo vệ dữ liệu, nghiệp vụ và trải nghiệm người dùng. Frontend validation hỗ trợ trải nghiệm; backend validation là nguồn quyết định.

## Validation Layers / Các lớp validation

| Layer / Lớp | Responsibility / Trách nhiệm |
| --- | --- |
| Frontend | Kiểm tra nhanh required, format, length và trạng thái form. |
| API DTO/Pipe | Kiểm request shape, type, required, format và sanitize. |
| Business Service | Kiểm rule nghiệp vụ, permission và trạng thái domain. |
| Database | Constraint cuối cùng cho unique, FK, not null và consistency. |

## Request Validation / Validation request

- Validate body, query, params và file upload.
- Reject field không được phép nếu contract yêu cầu.
- Trim/sanitize text khi phù hợp.
- Không tin dữ liệu từ client, kể cả role/permission/status.

## Business Validation / Validation nghiệp vụ

- Kiểm trạng thái đơn trước khi đổi status.
- Kiểm tồn kho trước khi đặt hàng.
- Kiểm coupon/promotion còn hiệu lực.
- Kiểm quyền trước hành động admin.
- Kiểm AI output cần duyệt trước khi publish/send.

## Error Response / Phản hồi lỗi

Validation error phải bám `.spec/data-contracts/validation-response.md`, có field path, message tiếng Việt phù hợp UI và code ổn định cho frontend xử lý.

