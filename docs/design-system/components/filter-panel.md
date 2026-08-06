# Filter Panel / Bảng lọc

## Purpose / Mục đích

Filter Panel giúp thu hẹp danh sách theo category, brand, price, status, date range, role, stock, payment, shipping hoặc AI-related state.

## Variant / Biến thể

- Storefront Filter: category, brand, price, availability, tag.
- Admin Filter: status, date range, role, stock, payment, shipping.
- Drawer Filter: mobile hoặc filter phức tạp.
- Inline Filter Bar: filter ngắn phía trên table/list.

## Size / Kích thước

Compact cho admin toolbar, standard cho desktop storefront, drawer/full-height cho mobile.

## State / Trạng thái

Default, dirty, applied, loading options, empty options, invalid combination.

## Accessibility / Khả năng tiếp cận

Filter group phải có label. Active filter cần hiển thị bằng tag có thể xóa nếu phù hợp.

## Responsive Rule / Quy tắc responsive

Mobile filter panel ưu tiên drawer hoặc sheet. Apply/reset action phải luôn dễ bấm.

## Usage / Cách dùng

Dùng cho product list, blog list, admin products, orders, inventory, customers, analytics và media.

## Do / Nên

- Hiển thị filter đã áp dụng.
- Có reset rõ.
- Chỉ dùng field được API Specification hỗ trợ.

## Don't / Không nên

- Không tự lọc theo field không có trong contract.
- Không áp dụng filter gây mất dữ liệu đang nhập.
- Không giấu trạng thái filter làm người dùng tưởng danh sách rỗng.

