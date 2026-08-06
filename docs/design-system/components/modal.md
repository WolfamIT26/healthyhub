# Modal / Hộp thoại

## Purpose / Mục đích

Modal dùng để yêu cầu người dùng tập trung vào một quyết định hoặc form ngắn như xác nhận hủy đơn, xóa media, đổi quyền hoặc xem lỗi quan trọng.

## Variant / Biến thể

- Confirmation: xác nhận hành động.
- Destructive Confirmation: hành động nguy hiểm.
- Short Form: form ngắn không cần rời màn hình.
- Alert Modal: thông báo chặn khi cần xử lý ngay.

## Size / Kích thước

Small cho xác nhận, medium cho form ngắn, large chỉ khi nội dung cần nhiều trường nhưng vẫn không thay thế page/drawer.

## State / Trạng thái

Open, closing, submitting, success, error, disabled action.

## Accessibility / Khả năng tiếp cận

Modal cần title rõ, focus management, đóng bằng hành động rõ và không mất dữ liệu khi vô tình đóng ở phase frontend.

## Responsive Rule / Quy tắc responsive

Mobile modal có thể full-width hoặc chuyển thành drawer nếu nội dung dài. Action chính luôn nhìn thấy.

## Usage / Cách dùng

Dùng cho action cần xác nhận hoặc nhập lý do ngắn. Với detail dài, ưu tiên Drawer hoặc page riêng.

## Do / Nên

- Nêu rõ hậu quả hành động.
- Dùng danger variant cho xóa/hủy/khóa.
- Hiển thị loading khi submit.

## Don't / Không nên

- Không dùng modal cho luồng nhiều bước phức tạp.
- Không mở modal chồng modal.
- Không giấu cancel action trong confirmation.

