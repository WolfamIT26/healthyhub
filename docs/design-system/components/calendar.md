# Calendar / Lịch

## Purpose / Mục đích

Calendar dùng để chọn ngày, khoảng thời gian, lịch khuyến mãi, thời gian báo cáo, lịch giao hàng hoặc lịch campaign.

## Variant / Biến thể

- Date Picker: chọn một ngày.
- Date Range Picker: chọn khoảng ngày.
- Date Time Picker: chọn ngày giờ.
- Calendar View: xem lịch campaign hoặc sự kiện.

## Size / Kích thước

Compact cho filter, standard cho form, full view cho lịch quản trị nếu cần.

## State / Trạng thái

Open, selected, range selected, disabled date, invalid range, loading availability.

## Accessibility / Khả năng tiếp cận

Ngày được chọn, khoảng ngày và ngày disabled phải có label rõ ở phase frontend. Cho phép nhập tay khi phù hợp.

## Responsive Rule / Quy tắc responsive

Mobile calendar cần vùng bấm đủ lớn; date range có thể chia thành start/end input nếu lịch quá chật.

## Usage / Cách dùng

Dùng cho promotion, coupon, analytics date range, order/shipping filter và campaign scheduling.

## Do / Nên

- Hiển thị timezone hoặc ngữ cảnh ngày nếu ảnh hưởng dữ liệu.
- Chặn range không hợp lệ.
- Giữ format ngày thân thiện với người Việt.

## Don't / Không nên

- Không cho chọn ngày hết hạn trước ngày bắt đầu.
- Không dùng calendar nếu chỉ cần chọn tháng/quý đơn giản.
- Không giấu lỗi timezone khi dữ liệu báo cáo lệch ngày.

