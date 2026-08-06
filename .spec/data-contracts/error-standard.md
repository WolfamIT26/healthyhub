# Error Standard / Chuẩn lỗi

## Purpose / Mục tiêu

Tài liệu này chuẩn hóa lỗi trong Data Contract để frontend, mobile, backend, AI và support xử lý thống nhất.

## Error Principle / Nguyên tắc lỗi

- Lỗi phải có code ổn định cho client xử lý.
- Message hiển thị cho người dùng phải thân thiện và theo locale.
- Không trả stack trace, SQL, provider secret, token hoặc prompt nội bộ.
- Lỗi validation phải chỉ rõ field và rule.
- Lỗi AI phải ghi rõ mức độ tin cậy, fallback và khả năng cần người kiểm tra.

## Error Code Format / Định dạng mã lỗi

Mã lỗi dùng pattern: `CATEGORY.DOMAIN.REASON`.

Ví dụ ý nghĩa:

| Segment / Phần | Meaning / Ý nghĩa |
| --- | --- |
| `CATEGORY` | Nhóm lỗi lớn như VALIDATION, BUSINESS, AUTH, SYSTEM hoặc AI. |
| `DOMAIN` | Domain liên quan như PRODUCT, ORDER, PAYMENT hoặc AI. |
| `REASON` | Nguyên nhân cụ thể, dùng chữ in hoa và dấu gạch dưới. |

## Error Categories / Nhóm lỗi

| Category / Nhóm | Meaning / Ý nghĩa | Handling / Cách xử lý |
| --- | --- | --- |
| `VALIDATION` | Dữ liệu đầu vào sai định dạng hoặc thiếu | Client sửa input và gửi lại. |
| `BUSINESS` | Vi phạm rule nghiệp vụ | Hiển thị message và hướng xử lý phù hợp. |
| `AUTH` | Chưa xác thực hoặc token không hợp lệ | Điều hướng đăng nhập hoặc refresh session. |
| `PERMISSION` | Không đủ quyền | Không retry tự động, hiển thị thông báo quyền. |
| `NOT_FOUND` | Resource không tồn tại hoặc không được phép thấy | Hiển thị trạng thái không tìm thấy. |
| `CONFLICT` | Xung đột trạng thái hoặc version | Reload dữ liệu hoặc yêu cầu xác nhận lại. |
| `RATE_LIMIT` | Gọi quá giới hạn | Chờ retry theo metadata nếu có. |
| `SYSTEM` | Lỗi hệ thống nội bộ | Ghi log, trả message an toàn. |
| `INTEGRATION` | Lỗi provider ngoài như payment, storage, notification | Có fallback hoặc retry policy. |
| `AI` | Lỗi AI provider, AI policy hoặc AI output | Có fallback và human review khi cần. |

## Error Object / Đối tượng lỗi

| Field / Trường | Required / Bắt buộc | Meaning / Ý nghĩa |
| --- | --- | --- |
| `code` | Có | Mã lỗi ổn định. |
| `category` | Có | Nhóm lỗi. |
| `domain` | Có | Domain liên quan. |
| `message` | Có | Thông điệp an toàn cho người dùng. |
| `details` | Không | Chi tiết bổ sung không nhạy cảm. |
| `validationErrors` | Có với validation error | Danh sách lỗi field. |
| `retryable` | Khuyến nghị | Client có nên retry hay không. |
| `retryAfter` | Không | Thời điểm hoặc số giây nên retry nếu rate limit/integration. |
| `supportCode` | Khuyến nghị | Mã hỗ trợ tra cứu log mà không lộ trace nội bộ. |

## Validation Error / Lỗi validation

Validation error áp dụng khi:

- Thiếu field bắt buộc.
- Sai kiểu dữ liệu.
- Sai format.
- Vượt độ dài.
- Giá trị ngoài range.
- Enum không hợp lệ.
- File upload sai loại hoặc vượt dung lượng.
- Input AI vượt giới hạn hoặc vi phạm policy.

## Business Error / Lỗi nghiệp vụ

Business error áp dụng khi:

- Product không còn bán.
- Cart item vượt tồn kho.
- Coupon hết hạn hoặc không đủ điều kiện.
- Order không thể hủy do đã giao.
- Payment không thể refund theo trạng thái hiện tại.
- Review không hợp lệ vì chưa mua hàng hoặc đã review.

## System Error / Lỗi hệ thống

System error áp dụng khi:

- Database không sẵn sàng.
- Queue hoặc storage lỗi.
- Unexpected runtime failure.
- Configuration thiếu nhưng không nên lộ chi tiết cho client.

## AI Error / Lỗi AI

AI error áp dụng khi:

- AI provider không phản hồi.
- AI output bị chặn bởi safety policy.
- Input vượt token hoặc file vượt giới hạn xử lý.
- Context không đủ quyền hoặc không đủ dữ liệu.
- Kết quả AI confidence quá thấp và không được phép tự động trả lời.

## Sensitive Data Rule / Quy tắc dữ liệu nhạy cảm trong lỗi

- Không trả giá trị password, token, OTP hoặc secret.
- Không trả SQL query hoặc tên bảng nội bộ trong message public.
- Không trả raw prompt hoặc raw model output nếu có rủi ro lộ dữ liệu.
- Rejected value trong validation chỉ trả khi an toàn; nếu nhạy cảm thì masking hoặc omit.

