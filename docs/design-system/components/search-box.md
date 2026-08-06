# Search Box / Ô tìm kiếm

## Purpose / Mục đích

Search Box giúp người dùng tìm sản phẩm, blog, đơn hàng, khách hàng, media hoặc dữ liệu admin nhanh.

## Variant / Biến thể

- Storefront Search: tìm sản phẩm public.
- Admin Search: tìm dữ liệu vận hành.
- AI Search Entry: chuyển sang AI Search khi cần hiểu ngôn ngữ tự nhiên.
- Global Search: tìm nhanh nếu sau này có nhu cầu.

## Size / Kích thước

Compact cho admin toolbar, standard cho product list, large cho search chính ở storefront.

## State / Trạng thái

Idle, focused, typing, searching, no result, error, suggestion available.

## Accessibility / Khả năng tiếp cận

Search input phải có label hoặc mô tả. Suggestion cần điều hướng được bằng bàn phím ở phase frontend.

## Responsive Rule / Quy tắc responsive

Mobile search nên dễ truy cập từ navbar hoặc đầu danh sách. Không làm ô search quá hẹp.

## Usage / Cách dùng

Dùng ở Home, Product List, Blog List, Admin tables, Media, Orders, Customers và AI Assistant entry.

## Do / Nên

- Trim keyword và giữ query khi chuyển trang.
- Hiển thị clear action khi có keyword.
- Phân biệt no result với lỗi API.

## Don't / Không nên

- Không tự tạo query field ngoài API Specification.
- Không tìm khi keyword quá ngắn nếu contract không cho phép.
- Không ẩn filter đang áp dụng khiến kết quả khó hiểu.

