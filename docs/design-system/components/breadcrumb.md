# Breadcrumb / Đường dẫn phân cấp

## Purpose / Mục đích

Breadcrumb giúp người dùng hiểu vị trí trong cấu trúc sản phẩm, blog hoặc admin detail.

## Variant / Biến thể

- Public Breadcrumb: category/product/blog.
- Admin Breadcrumb: admin section/detail.
- Compact Breadcrumb: mobile hoặc drawer.

## Size / Kích thước

Default cho page header. Compact cho mobile và admin dense screens.

## State / Trạng thái

Default, current item, truncated, loading label.

## Accessibility / Khả năng tiếp cận

Current item phải rõ. Separator không được đọc như nội dung quan trọng ở phase frontend.

## Responsive Rule / Quy tắc responsive

Mobile có thể rút gọn các cấp giữa nhưng giữ cấp trước và current item.

## Usage / Cách dùng

Dùng ở product detail, blog detail, admin detail page hoặc khu vực có phân cấp rõ.

## Do / Nên

- Dùng tên category/product/blog dễ hiểu.
- Giữ current item không click nếu phù hợp.
- Rút gọn khi tên dài.

## Don't / Không nên

- Không dùng breadcrumb thay navbar.
- Không hiển thị quá nhiều cấp gây rối.
- Không dùng raw id làm label.

