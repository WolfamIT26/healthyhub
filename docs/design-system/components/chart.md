# Chart / Biểu đồ

## Purpose / Mục đích

Chart dùng để hiển thị dữ liệu analytics như doanh số, đơn hàng, tồn kho, campaign, customer và AI insight.

## Variant / Biến thể

- Line Chart: xu hướng theo thời gian.
- Bar Chart: so sánh nhóm.
- Donut/Pie Chart: tỷ trọng đơn giản, dùng hạn chế.
- Metric Chart: KPI nhỏ.
- AI Insight Chart: biểu đồ có diễn giải AI đi kèm.

## Size / Kích thước

Small cho KPI card, medium cho dashboard panel, large cho analytics detail.

## State / Trạng thái

Loading, empty, filtered empty, error, partial data, data delayed.

## Accessibility / Khả năng tiếp cận

Chart cần title, legend, đơn vị đo và mô tả dữ liệu quan trọng bằng text. Không chỉ dựa vào màu.

## Responsive Rule / Quy tắc responsive

Mobile có thể giảm số series hoặc chuyển sang summary + table nếu chart khó đọc.

## Usage / Cách dùng

Dùng trong admin dashboard, analytics và AI analytics. Dữ liệu quan trọng cần có table/detail kèm theo nếu cần kiểm chứng.

## Do / Nên

- Ghi rõ khoảng thời gian và đơn vị.
- Dùng palette chart đủ tương phản.
- Hiển thị empty/error state riêng.

## Don't / Không nên

- Không dùng chart để trang trí khi không có insight.
- Không dùng quá nhiều màu gây khó đọc.
- Không để AI insight thay thế dữ liệu gốc.

