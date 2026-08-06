# Request Model / Mô hình request

## Purpose / Mục tiêu

Tài liệu này chuẩn hóa request model ở mức contract để các bước API Design, Backend Development, Frontend Development, Mobile Development và AI Integration dùng cùng một cách hiểu.

## Request Principle / Nguyên tắc request

- Request chỉ chứa dữ liệu client được phép gửi.
- Request không chứa field hệ thống tự sinh như `createdAt`, `updatedAt`, `createdBy`, `version` trừ khi có flow chuyên biệt được phê duyệt.
- Request không chứa dữ liệu tính toán lại được từ backend như order total cuối cùng, inventory final availability hoặc permission effective.
- Request liên quan AI phải ghi rõ mục đích, input scope và quyền dùng dữ liệu.

## Common Request Metadata / Metadata request dùng chung

| Field / Trường | Required / Bắt buộc | Meaning / Ý nghĩa |
| --- | --- | --- |
| `requestId` | Có ở request từ client hoặc gateway | ID theo dõi một request từ đầu đến cuối. |
| `traceId` | Có nếu request qua gateway/observability | ID liên kết log giữa nhiều service hoặc layer. |
| `contractVersion` | Có | Phiên bản contract client đang dùng. |
| `locale` | Khuyến nghị | Ngôn ngữ phản hồi mong muốn, mặc định `vi-VN`. |
| `timezone` | Khuyến nghị | Timezone người dùng, ví dụ `Asia/Ho_Chi_Minh`. |
| `tenantId` | Có với tenant-scoped context | Chuẩn bị SaaS/multi-store trong tương lai. |
| `actorType` | Có ở request đã xác thực | Loại người thực hiện: guest, customer, staff, admin hoặc AI agent. |
| `clientSource` | Khuyến nghị | Nguồn gọi: web, mobile, admin, integration hoặc AI. |

## Request Types / Loại request

| Type / Loại | Purpose / Mục tiêu | Rule / Quy tắc |
| --- | --- | --- |
| Create Request | Tạo resource mới | Không gửi ID nội bộ; chỉ gửi field người dùng được phép nhập. |
| Update Request | Cập nhật resource | Chỉ gửi field được phép sửa; có thể cần `version` để chống ghi đè. |
| Action Request | Thực hiện hành động nghiệp vụ | Có action reason nếu hành động ảnh hưởng order, payment, inventory hoặc security. |
| Detail Query Request | Lấy chi tiết một resource | Gửi resource ID và include policy nếu cần. |
| List Query Request | Lấy danh sách | Dùng pagination, filter, search, sort contract. |
| Bulk Request | Thao tác nhiều resource | Giới hạn số lượng item và trả partial result nếu nghiệp vụ cho phép. |
| Upload Request | Chuẩn bị hoặc xác nhận upload file | Dùng file transfer contract. |
| Import Request | Import dữ liệu từ file | Dùng import contract, có dry-run policy nếu cần. |
| Export Request | Xuất dữ liệu | Dùng export contract, có quyền và audit rõ. |
| AI Request | Yêu cầu AI xử lý | Có capability, input scope, user intent và safety context. |

## Payload Rule / Quy tắc payload

| Payload Area / Vùng payload | Rule / Quy tắc |
| --- | --- |
| Scalar field | Validate type, length, required và business rule. |
| Nested object | Chỉ dùng khi object phụ thuộc lifecycle của request chính. |
| Relationship reference | Dùng ID hoặc code rõ nghĩa, không gửi object đầy đủ nếu chỉ cần tham chiếu. |
| Collection | Có giới hạn số lượng item, không nhận collection vô hạn. |
| Snapshot data | Client không tự quyết định snapshot giao dịch quan trọng nếu backend có thể lấy từ nguồn chuẩn. |
| Admin reason | Bắt buộc với hành động quản trị nhạy cảm như hủy đơn, khóa tài khoản, điều chỉnh kho. |

## Include Policy / Quy tắc include dữ liệu liên quan

| Include Type / Loại include | Rule / Quy tắc |
| --- | --- |
| Default | Response chỉ trả dữ liệu chính cần thiết. |
| Optional include | Client có thể yêu cầu thêm dữ liệu liên quan nếu API sau này cho phép. |
| Sensitive include | Cần quyền riêng và audit. |
| AI include | Chỉ include dữ liệu nằm trong phạm vi người dùng được phép dùng cho AI. |

## Idempotency / Tính chống gửi lặp

Các request tạo tác động giao dịch nên hỗ trợ khóa chống gửi lặp ở bước API sau:

- Đặt hàng.
- Thanh toán.
- Tạo refund.
- Gửi notification hàng loạt.
- Import dữ liệu.
- AI action có chi phí hoặc ghi log quan trọng.

Contract cần mô tả idempotency key ở metadata hoặc action context khi thiết kế API cụ thể.

## Security Request Rule / Quy tắc bảo mật request

- Không gửi password, OTP hoặc token trong query string ở bước API sau.
- Field nhạy cảm phải có validation, masking trong log và retention rule.
- File upload request phải kiểm tra content type, size, checksum và purpose.
- AI request phải chặn prompt injection bằng context boundary và policy riêng.

