# API Implementation Standard / Chuẩn triển khai API

## Purpose / Mục tiêu

API implementation ở phase sau phải bám API Specification và Data Contract. Tài liệu này không tạo endpoint mới, chỉ quy định cách triển khai khi đến phase code.

## Source of Truth / Nguồn chuẩn

| Topic / Chủ đề | Source / Nguồn |
| --- | --- |
| Endpoint, method, URI | `.spec/api` |
| Request/response envelope | `.spec/data-contracts` |
| Error code/category | `.spec/api/error-catalog.md` và `.spec/data-contracts/error-standard.md` |
| Permission | `.spec/api` và Business Blueprint |
| UI usage | `.spec/ui-contract` |

## API Rules / Quy tắc API

- URI, method và version không được tự đổi khi chưa cập nhật API Specification.
- Response phải dùng envelope chuẩn.
- Error phải map đúng category và code.
- Request phải validate trước khi vào business rule.
- Authentication, authorization và permission phải kiểm ở backend.
- Pagination, filter, search và sort phải bám Data Contract.
- Upload/download/import/export phải bám File Transfer Contract.

## Idempotency / Idempotency

Áp dụng cho tạo đơn, payment callback, webhook, refund, gửi notification hàng loạt và các action có thể bị gửi lại. Nếu API Specification chưa ghi idempotency nhưng use case có rủi ro gửi trùng, phải cập nhật specification trước.

## Rate Limit / Giới hạn gọi API

- Public search, auth, AI và webhook cần rate limit theo API Specification.
- Rate limit error phải trả đúng Error Contract.
- Không dùng rate limit để thay thế permission hoặc validation.

## Gateway Boundary / Ranh giới gateway

API không gọi provider ngoài trực tiếp. Payment, storage, AI, OCR, vision, notification, analytics và integration phải đi qua gateway abstraction.

