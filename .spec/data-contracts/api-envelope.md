# API Envelope / Khung phản hồi API

## Purpose / Mục tiêu

Tài liệu này định nghĩa envelope chuẩn cho phản hồi API trong các bước thiết kế API sau. Envelope giúp frontend, mobile và AI client xử lý success, warning, error, pagination, metadata, trace ID và request ID nhất quán.

## Envelope Principle / Nguyên tắc envelope

- Mọi response public nên có envelope thống nhất.
- Envelope không thay thế HTTP status ở bước API sau, nhưng giúp client xử lý logic thống nhất.
- `requestId` và `traceId` phải được truyền xuyên suốt để hỗ trợ logging, monitoring và audit.
- Error envelope không được làm lộ stack trace, SQL, provider secret hoặc prompt nội bộ.

## Success Envelope / Envelope thành công

| Field / Trường | Required / Bắt buộc | Meaning / Ý nghĩa |
| --- | --- | --- |
| `success` | Có | Giá trị true khi xử lý thành công. |
| `status` | Có | Trạng thái logic là success. |
| `message` | Có | Thông điệp tiếng Việt hoặc theo locale. |
| `data` | Có | Dữ liệu chính, có thể null nếu action không cần data. |
| `metadata` | Có | Metadata chuẩn theo [Metadata Contract](metadata-contract.md). |
| `warnings` | Không | Danh sách cảnh báo nếu có. |
| `requestId` | Có | ID request. |
| `traceId` | Có | ID trace. |
| `contractVersion` | Có | Phiên bản contract. |

## Warning Envelope / Envelope cảnh báo

Warning envelope dùng khi request đã xử lý thành công nhưng có điều kiện cần báo cho client:

- Dữ liệu trả về đã bị giới hạn theo quyền.
- Một phần dữ liệu phụ không tải được nhưng dữ liệu chính vẫn hợp lệ.
- AI response có confidence thấp hoặc cần người dùng kiểm tra lại.
- Export/import đang xử lý bất đồng bộ.

| Field / Trường | Rule / Quy tắc |
| --- | --- |
| `success` | Vẫn là true nếu dữ liệu chính thành công. |
| `status` | Dùng warning. |
| `warnings` | Bắt buộc có ít nhất một warning item. |
| `data` | Trả dữ liệu chính nếu có. |

## Error Envelope / Envelope lỗi

| Field / Trường | Required / Bắt buộc | Meaning / Ý nghĩa |
| --- | --- | --- |
| `success` | Có | Giá trị false khi request thất bại. |
| `status` | Có | Trạng thái logic là error. |
| `message` | Có | Thông điệp lỗi thân thiện, không lộ chi tiết nội bộ. |
| `data` | Có | Thường là null khi lỗi. |
| `error` | Có | Chi tiết lỗi theo [Error Standard](error-standard.md). |
| `metadata` | Có | Metadata chuẩn. |
| `requestId` | Có | ID request để hỗ trợ support. |
| `traceId` | Có | ID trace để tra log. |
| `contractVersion` | Có | Phiên bản contract. |

## Pagination Envelope / Envelope phân trang

Response danh sách phải có:

- `data.items` là collection.
- `metadata.pagination` theo [Pagination Contract](pagination-contract.md).
- `metadata.appliedFilter`, `metadata.appliedSearch` và `metadata.appliedSort` nếu request có dùng.

## Metadata Rule / Quy tắc metadata

Metadata không dùng để chứa dữ liệu nghiệp vụ chính. Metadata chỉ dùng cho:

- Traceability.
- Pagination.
- Contract version.
- Locale/timezone.
- Data scope.
- Cache hint.
- Warning, deprecation hoặc AI safety signal.

## Request ID & Trace ID / Request ID và Trace ID

| ID / Mã | Meaning / Ý nghĩa | Rule / Quy tắc |
| --- | --- | --- |
| `requestId` | ID của request từ client/gateway | Trả lại trong mọi response. |
| `traceId` | ID liên kết log qua nhiều layer | Dùng cho monitoring, audit và debug. |
| `correlationId` | ID liên kết nhiều request trong một workflow | Có thể thêm trong metadata khi flow dài như order/payment/import. |

## Envelope Compatibility / Tương thích envelope

- Client không được phụ thuộc vào thứ tự field.
- Field mới trong metadata hoặc warnings được xem là non-breaking nếu không đổi nghĩa field cũ.
- Field `error.code` và enum value phải ổn định theo versioning rule.

