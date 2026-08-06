# Table / Bảng dữ liệu

## Purpose / Mục đích

Table dùng để quản lý dữ liệu có nhiều dòng/cột như sản phẩm, đơn hàng, khách hàng, tồn kho, payment, shipping, review, notification và analytics detail.

## Variant / Biến thể

- Standard Table: danh sách admin.
- Selectable Table: bulk action.
- Compact Table: dữ liệu phụ.
- Audit Table: lịch sử thay đổi.
- Analytics Table: số liệu có sort/export.

## Size / Kích thước

Compact cho admin dense view, standard cho danh sách chính, spacious chỉ dùng khi dữ liệu ít và cần đọc kỹ.

## State / Trạng thái

Loading, empty, filtered empty, error, selected rows, sorted, paginated, row action pending.

## Accessibility / Khả năng tiếp cận

Header phải rõ. Status cell cần badge có text. Row action icon-only cần label/tooltip ở phase frontend.

## Responsive Rule / Quy tắc responsive

Mobile chuyển sang compact list hoặc chỉ hiển thị cột ưu tiên. Không ép table quá rộng làm vỡ viewport.

## Usage / Cách dùng

Dùng trong admin/staff screens và account order/review nếu dữ liệu cần so sánh.

## Do / Nên

- Cho phép search/filter/sort/pagination theo API contract.
- Giữ column quan trọng gần bên trái.
- Hiển thị trạng thái loading/empty rõ.

## Don't / Không nên

- Không dùng table cho product grid public.
- Không nhồi quá nhiều action trong một row.
- Không dùng màu status mà thiếu label.

