# Input / Ô nhập liệu

## Purpose / Mục đích

Input dùng cho dữ liệu một dòng như tên, số điện thoại, email, địa chỉ ngắn, mã coupon, số lượng hoặc từ khóa.

## Variant / Biến thể

- Text: nhập chữ thông thường.
- Number: số lượng, giá trị số.
- Password: mật khẩu.
- Search-like: input tìm kiếm khi chưa cần Search Box đầy đủ.
- Readonly: dữ liệu chỉ đọc.

## Size / Kích thước

Small cho table/filter, medium cho form mặc định, large cho form checkout hoặc auth cần dễ thao tác.

## State / Trạng thái

Default, focus, filled, disabled, readonly, invalid, success, loading validation.

## Accessibility / Khả năng tiếp cận

Mỗi input phải có label. Error/helper text cần liên kết với field ở phase frontend. Placeholder không thay thế label.

## Responsive Rule / Quy tắc responsive

Mobile input chiếm đủ chiều rộng vùng form. Numeric input phải tránh quá nhỏ khi dùng cho cart quantity.

## Usage / Cách dùng

Dùng cho form auth, checkout, profile, admin product, admin user và filter đơn giản.

## Do / Nên

- Ghi rõ required/optional.
- Hiển thị lỗi cạnh field.
- Trim dữ liệu text khi phù hợp theo validation.

## Don't / Không nên

- Không dùng input tự do cho dữ liệu nên chọn bằng Select.
- Không giấu label trong placeholder.
- Không hiển thị dữ liệu nhạy cảm nếu không có masking.

