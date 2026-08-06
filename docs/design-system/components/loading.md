# Loading / Đang tải

## Purpose / Mục đích

Loading cho biết hệ thống đang xử lý thao tác như submit form, refresh list, upload, export, import, payment check hoặc AI request.

## Variant / Biến thể

- Inline Loading: trong button hoặc field.
- Section Loading: một vùng dữ liệu.
- Page Loading: tải màn hình ban đầu.
- Blocking Loading: thao tác không được rời khi đang xử lý.
- Job Loading: upload/import/export chạy nền.

## Size / Kích thước

Small cho button, medium cho section, large cho page-level nếu thật sự cần.

## State / Trạng thái

Idle, loading, retrying, timeout, success, error.

## Accessibility / Khả năng tiếp cận

Loading phải có text khi thời gian xử lý có thể dài. Không chỉ hiển thị spinner không giải thích.

## Responsive Rule / Quy tắc responsive

Mobile không dùng loading overlay che toàn màn hình nếu vẫn có thể giữ người dùng trong context.

## Usage / Cách dùng

Dùng cho action đang chờ response. Nếu tải cấu trúc lớn, ưu tiên Skeleton.

## Do / Nên

- Disable action submit khi loading.
- Hiển thị timeout/fallback cho AI hoặc provider.
- Giữ dữ liệu cũ khi refresh list nếu có thể.

## Don't / Không nên

- Không dùng loading vô thời hạn không có hướng xử lý.
- Không làm người dùng nghĩ payment/order đã thành công khi chưa có response.
- Không che thông tin lỗi bằng loading.

