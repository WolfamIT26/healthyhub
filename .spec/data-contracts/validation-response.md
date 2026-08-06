# Validation Response / Chuẩn phản hồi validation

## Purpose / Mục tiêu

Tài liệu này chuẩn hóa cách trả lỗi validation để frontend, mobile và admin UI có thể hiển thị lỗi cạnh field, lỗi tổng quát và lỗi theo collection.

## Validation Principle / Nguyên tắc validation

- Validation response phải chỉ ra field nào sai và sai vì rule nào.
- Message hiển thị cho người dùng dùng tiếng Việt theo locale.
- Validation không được tiết lộ dữ liệu nhạy cảm.
- Validation phải chạy ở backend ngay cả khi frontend đã kiểm tra.

## Field Validation Error / Lỗi validation theo field

| Field / Trường | Required / Bắt buộc | Meaning / Ý nghĩa |
| --- | --- | --- |
| `field` | Có | Tên field theo contract camelCase. |
| `code` | Có | Mã lỗi validation ổn định. |
| `message` | Có | Thông điệp hiển thị. |
| `rule` | Khuyến nghị | Rule bị vi phạm như required, format, min, max, enum. |
| `rejectedValuePolicy` | Khuyến nghị | Cho biết rejected value bị omit, masked hoặc safe_to_show. |
| `path` | Có với nested/collection | Đường dẫn logic đến field lỗi. |

## Validation Code Catalog / Danh mục mã validation

| Code / Mã | Meaning / Ý nghĩa |
| --- | --- |
| `REQUIRED` | Thiếu field bắt buộc. |
| `INVALID_TYPE` | Sai kiểu dữ liệu. |
| `INVALID_FORMAT` | Sai định dạng. |
| `INVALID_LENGTH` | Độ dài không hợp lệ. |
| `OUT_OF_RANGE` | Giá trị ngoài khoảng cho phép. |
| `INVALID_ENUM` | Giá trị enum không hợp lệ. |
| `DUPLICATED_VALUE` | Trùng giá trị cần unique. |
| `INVALID_RELATION` | ID tham chiếu không tồn tại hoặc không được phép dùng. |
| `INVALID_FILE_TYPE` | Loại file không được phép. |
| `FILE_TOO_LARGE` | File vượt dung lượng. |
| `UNSAFE_AI_INPUT` | Input AI vi phạm policy. |

## Collection Validation / Validation collection

| Situation / Tình huống | Rule / Quy tắc |
| --- | --- |
| Item trong collection sai | Dùng path có chỉ số item hoặc khóa định danh an toàn. |
| Quá nhiều item | Trả lỗi ở field collection, không cần liệt kê từng item. |
| Duplicate item | Trả lỗi ở field collection và nêu rule duplicate. |
| Partial success không được phép | Toàn bộ request thất bại. |
| Partial success được phép | Trả theo import/bulk result contract, không dùng success response thường. |

## Cross Field Validation / Validation liên field

Cross field validation áp dụng khi:

- `startAt` phải trước `endAt`.
- `discountAmount` và `discountRate` không được dùng lẫn nếu discount type không cho phép.
- Shipping address cần đủ thông tin theo phương thức giao hàng.
- Coupon condition phụ thuộc order total, customer segment hoặc thời gian.
- AI request cần có input hoặc context reference hợp lệ.

Validation liên field nên trả `field` là field chính gây lỗi và `details` giải thích field liên quan nếu an toàn.

## Business Validation / Validation nghiệp vụ

Nếu dữ liệu đúng format nhưng vi phạm nghiệp vụ, ưu tiên trả Business Error thay vì Validation Error.

Ví dụ:

- Product ID đúng định dạng nhưng sản phẩm đã ngừng bán.
- Coupon code đúng định dạng nhưng hết hạn.
- Payment amount đúng định dạng nhưng không khớp order cần thanh toán.
- AI capability đúng enum nhưng user không có quyền dùng capability đó.

## UI Mapping / Mapping giao diện

- Field error hiển thị cạnh input tương ứng.
- Global validation error hiển thị ở đầu form hoặc trong alert.
- Collection error hiển thị tại row/item tương ứng nếu UI hỗ trợ.
- Warning không chặn submit phải dùng warning response thay vì validation error.

