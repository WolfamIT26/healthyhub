# Skeleton / Khung tải dữ liệu

## Purpose / Mục đích

Skeleton giữ layout ổn định trong khi dữ liệu đang tải, đặc biệt với product card, table, detail page, dashboard và AI response.

## Variant / Biến thể

- Card Skeleton: product/blog/card.
- Table Skeleton: admin table.
- Detail Skeleton: product/order/customer detail.
- Chart Skeleton: analytics.
- AI Response Skeleton: AI đang xử lý.

## Size / Kích thước

Theo component thật. Skeleton không tự có kích thước tùy tiện.

## State / Trạng thái

Initial loading, refreshing, partial loading, long loading.

## Accessibility / Khả năng tiếp cận

Skeleton cần có trạng thái tải được mô tả ở phase frontend. Không dùng chuyển động mạnh gây khó chịu.

## Responsive Rule / Quy tắc responsive

Skeleton phải theo layout responsive thật để tránh nhảy layout khi dữ liệu xuất hiện.

## Usage / Cách dùng

Dùng khi dữ liệu async cần giữ cấu trúc nhìn thấy. Với thao tác ngắn, Loading có thể phù hợp hơn.

## Do / Nên

- Khớp hình dạng với nội dung thật.
- Giữ chiều cao ổn định.
- Dùng cho page/list/detail load.

## Don't / Không nên

- Không dùng skeleton chung mơ hồ cho mọi thứ.
- Không dùng skeleton cho lỗi hoặc empty state.
- Không tạo animation gây phân tâm trong admin.

