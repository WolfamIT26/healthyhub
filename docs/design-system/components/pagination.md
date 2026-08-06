# Pagination / Phân trang

## Purpose / Mục đích

Pagination giúp điều hướng danh sách lớn như sản phẩm, đơn hàng, khách hàng, tồn kho, blog, review và notification.

## Variant / Biến thể

- Page Number: danh sách truyền thống.
- Cursor: timeline hoặc notification nếu API hỗ trợ.
- Load More: storefront hoặc mobile list khi phù hợp.
- Compact: admin table nhỏ.

## Size / Kích thước

Small cho admin table, medium cho danh sách chính, large hiếm dùng cho mobile-friendly storefront.

## State / Trạng thái

First page, middle page, last page, loading page, disabled navigation, empty list.

## Accessibility / Khả năng tiếp cận

Nút phân trang cần label rõ như trang trước/trang sau. Current page phải được nhận biết không chỉ bằng màu.

## Responsive Rule / Quy tắc responsive

Mobile rút gọn số page hiển thị hoặc dùng load more nếu phù hợp với UI Contract.

## Usage / Cách dùng

Dùng khi API trả pagination metadata. Filter/search/sort thay đổi nên reset về page hợp lệ.

## Do / Nên

- Hiển thị tổng số nếu API có.
- Giữ filter/sort khi chuyển page.
- Disable nút không hợp lệ.

## Don't / Không nên

- Không dùng pagination nếu danh sách chỉ có vài item.
- Không làm mất scroll/context khi đổi page nếu không cần.
- Không tự đoán số trang khi API không trả metadata.

