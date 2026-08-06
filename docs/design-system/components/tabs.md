# Tabs / Tab

## Purpose / Mục đích

Tabs dùng để chia nội dung cùng cấp trong một màn hình như thông tin sản phẩm, lịch sử đơn, profile sections, admin settings hoặc AI review panel.

## Variant / Biến thể

- Line Tabs: tab ngang tiêu chuẩn.
- Segmented Tabs: chọn chế độ ngắn.
- Vertical Tabs: settings/admin nhiều nhóm.
- Status Tabs: lọc theo trạng thái nếu số trạng thái ít.

## Size / Kích thước

Small cho panel, medium cho page section, large hiếm dùng.

## State / Trạng thái

Default, active, hover, focus, disabled, loading tab content.

## Accessibility / Khả năng tiếp cận

Active tab phải rõ bằng text/indicator. Keyboard navigation cần được xử lý ở phase frontend.

## Responsive Rule / Quy tắc responsive

Mobile tab nhiều mục có thể scroll ngang hoặc chuyển thành select nếu quá dài.

## Usage / Cách dùng

Dùng khi nội dung liên quan cùng một route/page. Không dùng tabs để thay navigation chính nếu nội dung là route độc lập.

## Do / Nên

- Giữ label ngắn.
- Mặc định mở tab quan trọng nhất.
- Giữ trạng thái tab khi quay lại nếu có lợi cho workflow.

## Don't / Không nên

- Không dùng quá nhiều tabs cùng cấp.
- Không giấu action quan trọng trong tab phụ khó thấy.
- Không dùng tab cho wizard checkout nhiều bước.

