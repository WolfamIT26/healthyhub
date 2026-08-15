# API Specification Status / Trạng thái API Specification

## Purpose / Mục tiêu

File này theo dõi trạng thái bộ API Specification của HealthyHub.

## Current Status / Trạng thái hiện tại

| Item / Hạng mục | Status / Trạng thái | Note / Ghi chú |
| --- | --- | --- |
| API Index | Completed | Đã tạo mục lục và thứ tự đọc. |
| API Conventions | Completed | Đã chuẩn hóa REST naming, URI, method, status code, versioning và trace/request ID. |
| API Security | Completed | Đã chuẩn hóa JWT, refresh token, permission, role, API key, CORS và rate limit. |
| Authentication Flow | Completed | Đã mô tả login, refresh, logout, verify email và reset password. |
| Error Catalog | Completed | Đã mapping lỗi common và lỗi theo domain. |
| Domain API Map | Completed | Đã mapping 23 domain sang namespace, audience, permission và contract. |
| Endpoint Matrix | Completed | Đã tạo matrix tổng quan endpoint chính. |
| Rate Limit Policy | Completed | Đã phân loại mức rate limit theo endpoint group. |
| Webhook Policy | Completed | Đã chuẩn hóa webhook payment, shipping, notification và integration. |
| Domain API Specs | Completed | Đã tạo 23 file API theo domain. |

## Completion State / Mức hoàn thành

API Specification hoàn thành ở mức tài liệu thiết kế để làm đầu vào cho OpenAPI, Backend và Frontend ở các bước sau.

Prompt 31 Product/Category/Brand public read subset is executable and aligned with exact OpenAPI schemas; operation inventory remains 196.

## Not Included / Không bao gồm

- Chưa tạo OpenAPI hoặc Swagger.
- Chưa viết controller, service, repository, DTO code hoặc entity.
- Chưa viết validation runtime.
- Chưa tạo migration hoặc SQL.
