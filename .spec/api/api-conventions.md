# API Conventions / Quy ước API

## Purpose / Mục tiêu

Tài liệu này chuẩn hóa REST naming, URI naming, HTTP method, status code, versioning, deprecation, trace ID và request ID cho toàn bộ API HealthyHub.

## Base URI / URI gốc

| Item / Thành phần | Convention / Quy ước |
| --- | --- |
| Base API | `/api/v1` |
| Public API | `/api/v1/public` |
| Customer self API | `/api/v1/me` |
| Admin API | `/api/v1/admin` |
| AI API | `/api/v1/ai` |
| Webhook API | `/api/v1/webhooks` |

## REST Naming / Đặt tên REST

| Rule / Quy tắc | Guidance / Hướng dẫn |
| --- | --- |
| Resource name | Dùng danh từ số nhiều, tiếng Anh, kebab-case khi nhiều từ. |
| Action | Chỉ dùng action segment khi thao tác không phải CRUD thuần. |
| ID parameter | Dùng tên rõ nghĩa như `{productId}`, `{orderId}`, `{customerId}`. |
| Nested resource | Chỉ nesting khi resource phụ thuộc rõ lifecycle hoặc ownership. |
| Query fields | Dùng `camelCase`, không dùng tên cột database. |
| Response field | Theo Data Contract, dùng `camelCase`. |

## HTTP Method / Phương thức HTTP

| Method / Phương thức | Usage / Cách dùng |
| --- | --- |
| GET | Lấy danh sách, chi tiết, option, status hoặc preview không thay đổi dữ liệu. |
| POST | Tạo mới, chạy action nghiệp vụ, validate coupon, tạo job, tạo upload intent. |
| PATCH | Cập nhật một phần resource hoặc đổi trạng thái. |
| DELETE | Xóa mềm, remove item, hủy quan hệ hoặc archive nếu API sau này quy định rõ. |

## URI Examples / Ví dụ URI

| Purpose / Mục tiêu | URI Pattern / Mẫu URI |
| --- | --- |
| Public list | `/api/v1/public/products` |
| Customer own data | `/api/v1/me/orders` |
| Admin management | `/api/v1/admin/products/{productId}` |
| Action | `/api/v1/admin/orders/{orderId}/cancel` |
| AI capability | `/api/v1/ai/recommendations/products` |
| Webhook | `/api/v1/webhooks/payment/{provider}` |

## Status Code / Mã trạng thái

| Status / Mã | Meaning / Ý nghĩa | Rule / Quy tắc |
| --- | --- | --- |
| 200 | OK | Thành công thông thường, action thành công có envelope. |
| 201 | Created | Tạo resource mới. |
| 202 | Accepted | Job bất đồng bộ, import/export, AI async hoặc webhook accepted. |
| 400 | Bad Request | Request sai format tổng thể. |
| 401 | Unauthorized | Chưa xác thực hoặc token không hợp lệ. |
| 403 | Forbidden | Đã xác thực nhưng không đủ quyền. |
| 404 | Not Found | Resource không tồn tại hoặc không được phép thấy. |
| 409 | Conflict | Xung đột trạng thái, version hoặc idempotency. |
| 422 | Unprocessable Entity | Validation hoặc business validation thất bại. |
| 429 | Too Many Requests | Vượt rate limit. |
| 500 | Internal Server Error | Lỗi hệ thống không lộ chi tiết. |
| 502 | Bad Gateway | Gateway/provider ngoài lỗi. |
| 503 | Service Unavailable | Service hoặc provider tạm không sẵn sàng. |

## Envelope Rule / Quy tắc envelope

- Mọi response JSON dùng envelope theo [API Envelope](../data-contracts/api-envelope.md).
- API tránh dùng 204 trong giai đoạn đầu để giữ response envelope thống nhất.
- Error response dùng [Error Standard](../data-contracts/error-standard.md).
- Pagination dùng [Pagination Contract](../data-contracts/pagination-contract.md).

## Versioning / Phiên bản API

| Item / Thành phần | Rule / Quy tắc |
| --- | --- |
| URI version | Dùng `/api/v1` cho version đầu. |
| Contract version | Trả `contractVersion` trong envelope. |
| Breaking change | Tạo major version mới như `/api/v2`. |
| Non-breaking change | Thêm field optional, thêm endpoint hoặc thêm enum value có fallback. |

## Deprecation / Ngừng hỗ trợ

- Endpoint bị deprecate phải được ghi trong `ChangeLog.md`, API docs và metadata nếu cần.
- Cần có replacement endpoint hoặc migration note.
- Không xóa endpoint đang dùng nếu chưa hết thời gian hỗ trợ.
- Field contract bị deprecate phải theo [Data Contract Versioning](../data-contracts/versioning.md).

## Trace ID & Request ID / Trace ID và Request ID

| Header / Header | Required / Bắt buộc | Rule / Quy tắc |
| --- | --- | --- |
| `X-Request-Id` | Có | Client hoặc gateway gửi; backend trả lại trong response. |
| `X-Trace-Id` | Có | Gateway/backend tạo nếu client chưa gửi; dùng cho logging xuyên layer. |
| `X-Idempotency-Key` | Có với action nhạy cảm | Dùng cho order, payment, refund, import/export và AI action có chi phí. |
| `Accept-Language` | Khuyến nghị | Ưu tiên `vi-VN`, hỗ trợ `en-US` sau này. |

## Query Convention / Quy ước query

- Pagination dùng `page`, `pageSize` hoặc cursor theo tài liệu domain.
- Filter/search/sort chỉ nhận field nằm trong whitelist của endpoint.
- Search keyword dùng `q`.
- Sort dùng field contract và direction `asc` hoặc `desc`.
- Include dữ liệu liên quan phải được endpoint cho phép rõ.

