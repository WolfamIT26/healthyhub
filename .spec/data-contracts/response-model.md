# Response Model / Mô hình response

## Purpose / Mục tiêu

Tài liệu này chuẩn hóa response model ở mức contract để mọi client nhận dữ liệu theo cùng một cấu trúc, dễ xử lý lỗi, phân trang, metadata và warning.

## Response Principle / Nguyên tắc response

- Response phải nhất quán theo API envelope.
- Response không trả field nhạy cảm.
- Response list phải gọn hơn response detail.
- Response admin có thể nhiều metadata hơn nhưng vẫn cần kiểm soát quyền.
- Response AI phải có confidence và traceability khi có nội dung gợi ý hoặc phân tích.

## Common Response Fields / Field response dùng chung

| Field / Trường | Meaning / Ý nghĩa | Rule / Quy tắc |
| --- | --- | --- |
| `success` | Trạng thái thành công | Bắt buộc trong envelope. |
| `status` | Trạng thái xử lý | Dùng giá trị ổn định như success, warning, error. |
| `message` | Thông điệp ngắn | Dùng tiếng Việt theo locale, không chứa thông tin nhạy cảm. |
| `data` | Dữ liệu chính | Null khi lỗi không có dữ liệu trả về. |
| `error` | Thông tin lỗi | Chỉ có khi response lỗi. |
| `warnings` | Cảnh báo không chặn xử lý | Chỉ có khi cần. |
| `metadata` | Metadata kỹ thuật và ngữ cảnh | Theo [Metadata Contract](metadata-contract.md). |
| `requestId` | ID request | Trả lại để đối chiếu. |
| `traceId` | ID trace | Trả lại để hỗ trợ debug và audit. |
| `contractVersion` | Phiên bản contract | Giúp client kiểm soát tương thích. |

## Response Types / Loại response

| Type / Loại | Usage / Cách dùng |
| --- | --- |
| Success Response | Dùng khi request được xử lý thành công hoàn toàn. |
| Warning Response | Dùng khi request thành công nhưng có cảnh báo không chặn. |
| Error Response | Dùng khi request thất bại vì validation, business, auth, permission, system, AI hoặc integration error. |
| Validation Response | Dùng khi dữ liệu đầu vào không hợp lệ. |
| Paginated Response | Dùng cho danh sách có phân trang. |
| File Response | Dùng cho upload/download/import/export metadata. |
| AI Response | Dùng cho kết quả AI chat, recommendation, search, compare, OCR, vision, marketing hoặc analytics. |

## List Output Rule / Quy tắc response danh sách

- List output chỉ trả field đủ để hiển thị danh sách, lọc nhanh và action cơ bản.
- Không trả mô tả dài, lịch sử đầy đủ, log đầy đủ hoặc nested relationship lớn trong list.
- Mọi list có pagination phải có pagination metadata.
- Nếu list bị giới hạn do quyền, metadata cần phản ánh data scope nếu phù hợp.

## Detail Output Rule / Quy tắc response chi tiết

- Detail output trả đầy đủ field cần cho một màn hình chi tiết.
- Relationship quan trọng có thể trả dạng summary object, không cần trả toàn bộ object sâu.
- Audit field trong public detail chỉ trả khi có giá trị cho người dùng.
- Admin detail có thể trả thêm status, visibility, audit summary và operational note nếu có quyền.

## Action Output Rule / Quy tắc response hành động

Action response nên trả:

- Resource chính sau khi hành động hoàn tất.
- Trạng thái mới của resource.
- Cảnh báo hoặc bước tiếp theo nếu có.
- Metadata audit khi hành động có rủi ro nghiệp vụ.

Không trả dữ liệu tạm thời nội bộ của provider, queue, payment hoặc AI nếu không cần cho client.

## Empty Response Rule / Quy tắc response rỗng

- Nếu action thành công nhưng không cần data, `data` có thể null và message phải rõ.
- Danh sách không có item phải trả collection rỗng kèm pagination metadata.
- Response lỗi không dùng collection rỗng để che lỗi.

