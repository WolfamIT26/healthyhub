# Alert / Cảnh báo

## Purpose / Mục đích

Alert hiển thị thông tin cần chú ý trong màn hình như lỗi hệ thống, cảnh báo tồn kho, disclaimer dinh dưỡng, payment issue hoặc AI safety notice.

## Variant / Biến thể

- Info: thông tin bổ sung.
- Success: hoàn tất hoặc trạng thái tốt.
- Warning: cần chú ý nhưng chưa chặn.
- Danger: lỗi hoặc rủi ro.
- AI Safety: cảnh báo giới hạn AI.

## Size / Kích thước

Inline cho form/section, block cho page-level alert, compact cho table/detail.

## State / Trạng thái

Visible, dismissible, persistent, action required, loading follow-up.

## Accessibility / Khả năng tiếp cận

Alert phải có title hoặc message rõ. Không chỉ dùng màu/icon. Nội dung critical phải được đặt gần nơi cần xử lý.

## Responsive Rule / Quy tắc responsive

Mobile alert không được đẩy CTA chính quá xa nếu có thể đặt inline đúng ngữ cảnh.

## Usage / Cách dùng

Dùng cho thông tin cần đọc trước khi tiếp tục hoặc hiểu trạng thái dữ liệu.

## Do / Nên

- Dùng warning cho sắp hết hàng hoặc AI thiếu dữ liệu.
- Dùng danger cho action bị chặn.
- Dùng AI safety cho disclaimer hoặc output bị chặn.

## Don't / Không nên

- Không lạm dụng alert cho message bình thường.
- Không dùng alert thay empty state.
- Không để alert quá dài trong admin table.

