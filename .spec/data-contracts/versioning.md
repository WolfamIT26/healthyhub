# Versioning / Quản lý phiên bản Data Contract

## Purpose / Mục tiêu

Tài liệu này định nghĩa cách quản lý version cho Data Contract để HealthyHub có thể phát triển dài hạn mà không phá frontend, mobile, integration hoặc AI client.

## Version Format / Định dạng version

| Item / Thành phần | Rule / Quy tắc |
| --- | --- |
| Contract version | Dùng dạng `v1`, `v2` cho major version public. |
| Internal revision | Có thể dùng changelog nội bộ theo ngày hoặc semantic nếu cần. |
| API route version | Sẽ quyết định ở API Design, không tạo trong Prompt 09.5. |
| Document version | Theo ChangeLog của `.spec/data-contracts`. |

## Compatibility Rule / Quy tắc tương thích

| Change / Thay đổi | Compatibility / Tương thích |
| --- | --- |
| Thêm field optional vào response | Compatible. |
| Thêm metadata optional | Compatible. |
| Thêm enum value | Compatible nếu client có fallback unknown. |
| Thêm validation rule chặt hơn | Có thể breaking nếu request cũ bị từ chối. |
| Đổi tên field | Breaking. |
| Đổi kiểu dữ liệu field | Breaking. |
| Đổi ý nghĩa field | Breaking. |
| Xóa field response đang dùng | Breaking. |
| Xóa enum value | Breaking. |

## Backward Compatibility / Tương thích ngược

- Client cũ phải tiếp tục hoạt động trong thời gian deprecation.
- Field mới nên optional ở ít nhất một chu kỳ release nếu client chưa bắt kịp.
- Backend có thể trả thêm metadata nhưng không ép client cũ phải hiểu ngay.
- AI contract mới phải giữ shape cũ nếu prompt hoặc agent cũ còn dùng.

## Deprecation Strategy / Chiến lược ngừng hỗ trợ

| Step / Bước | Rule / Quy tắc |
| --- | --- |
| Announce | Ghi rõ field/enum/contract bị deprecate trong ChangeLog và API docs sau này. |
| Mark | Trả deprecation metadata nếu cần cảnh báo client. |
| Support Window | Duy trì contract cũ trong thời gian hợp lý theo release strategy. |
| Migration Guide | Cung cấp mapping từ field cũ sang field mới. |
| Remove | Chỉ xóa khi đã hết thời gian hỗ trợ và có approval. |

## Contract Review Rule / Quy tắc review contract

Mọi thay đổi contract phải kiểm tra:

- Có phá frontend hiện tại không.
- Có phá mobile app tương lai không.
- Có ảnh hưởng AI prompt hoặc AI context pack không.
- Có ảnh hưởng import/export không.
- Có làm lộ dữ liệu nhạy cảm không.
- Có cần cập nhật enum, validation, metadata hoặc error standard không.

## Release Rule / Quy tắc release

- Mỗi đợt thay đổi Data Contract cần cập nhật `ChangeLog.md`.
- Nếu ảnh hưởng API Design sau này, phải cập nhật API spec tương ứng.
- Nếu ảnh hưởng database mapping, phải kiểm tra lại Logical và Physical Database Design.
- Nếu ảnh hưởng AI output, phải cập nhật AI response contract và AI documentation.

