# Data Contract Implementation / Triển khai Data Contract

## Purpose / Mục tiêu

Data Contract đảm bảo Backend, Frontend, Mobile App và AI dùng cùng một chuẩn dữ liệu. Khi triển khai code sau này, contract phải được phản ánh nhất quán ở DTO, service response, API client, form và UI state.

## Contract Alignment / Bám contract

- Request model phải bám `.spec/data-contracts/request-model.md`.
- Response model phải bám `.spec/data-contracts/response-model.md`.
- Envelope phải bám `.spec/data-contracts/api-envelope.md`.
- Pagination, filter, search và sort phải bám contract tương ứng.
- Error, validation và AI response phải bám tài liệu chuẩn tương ứng.

## Data Format / Định dạng dữ liệu

| Data / Dữ liệu | Rule / Quy tắc |
| --- | --- |
| DateTime | Dùng chuẩn UTC ISO 8601 trong contract, hiển thị theo timezone người dùng. |
| Currency | Dữ liệu tiền tệ dùng định dạng contract, UI hiển thị theo tiếng Việt. |
| Decimal | Không làm tròn tùy tiện khi chưa có rule. |
| Boolean | Dùng boolean thật, không dùng chuỗi thay thế. |
| Null | Phân biệt null, optional và empty collection theo contract. |
| File URL | Không tự tạo URL ngoài Storage Gateway/contract. |
| Image URL | Ảnh sản phẩm dùng media/storage contract. |

## DTO Rule / Quy tắc DTO

- DTO code sau này không được thêm field ngoài contract nếu chưa cập nhật specification.
- Field nhạy cảm không trả về frontend nếu không có quyền.
- DTO list và detail có thể khác nhau nhưng phải được mô tả rõ.
- Validation response phải map field path chính xác để frontend hiển thị lỗi.

## AI Response Rule / Quy tắc response AI

- AI output cần source, confidence và safety metadata khi contract yêu cầu.
- AI blocked/fallback không được trả như success thông thường nếu người dùng cần biết giới hạn.
- Không trả dữ liệu nhạy cảm trong metadata AI.

