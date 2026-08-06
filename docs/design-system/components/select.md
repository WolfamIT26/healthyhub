# Select / Danh sách chọn

## Purpose / Mục đích

Select dùng để chọn một hoặc nhiều giá trị từ danh sách đã biết như category, brand, trạng thái đơn, role, shipping method hoặc sort option.

## Variant / Biến thể

- Single Select: chọn một giá trị.
- Multi Select: chọn nhiều giá trị.
- Searchable Select: danh sách dài cần tìm nhanh.
- Async Select: dữ liệu lấy từ API.
- Status Select: đổi trạng thái có kiểm soát.

## Size / Kích thước

Small cho filter/table, medium cho form mặc định, large cho checkout hoặc mobile-first form.

## State / Trạng thái

Default, open, selected, disabled, invalid, loading options, empty options.

## Accessibility / Khả năng tiếp cận

Phải có label, trạng thái đang mở và option được chọn rõ. Không chỉ dùng màu để phân biệt option.

## Responsive Rule / Quy tắc responsive

Mobile có thể dùng bottom sheet ở phase frontend nếu option nhiều. Admin filter giữ select nhỏ nhưng readable.

## Usage / Cách dùng

Dùng cho filter, form quản trị, trạng thái đơn/kho, phân quyền và lựa chọn checkout.

## Do / Nên

- Dùng label tiếng Việt cho enum.
- Hiển thị loading khi option lấy từ API.
- Yêu cầu confirmation khi đổi trạng thái nhạy cảm.

## Don't / Không nên

- Không dùng select cho danh sách quá dài nếu cần search.
- Không hiển thị raw enum cho customer.
- Không tự động lưu khi đổi trạng thái nguy hiểm nếu chưa xác nhận.

