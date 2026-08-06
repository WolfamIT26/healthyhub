# Drawer / Ngăn trượt

## Purpose / Mục đích

Drawer dùng để xem hoặc chỉnh thông tin phụ mà không rời danh sách, đặc biệt trong admin order, product, customer và inventory.

## Variant / Biến thể

- Detail Drawer: xem chi tiết.
- Edit Drawer: chỉnh form vừa phải.
- Filter Drawer: filter trên mobile.
- AI Review Drawer: xem nguồn, output và lịch sử AI.

## Size / Kích thước

Narrow cho filter, standard cho detail, wide cho admin form hoặc analytics insight.

## State / Trạng thái

Open, loading, dirty form, submitting, error, close confirmation.

## Accessibility / Khả năng tiếp cận

Drawer cần title, focus trap ở phase frontend, nút đóng rõ và confirmation nếu có dữ liệu chưa lưu.

## Responsive Rule / Quy tắc responsive

Mobile drawer thường chiếm gần toàn màn hình. Desktop drawer không che hoàn toàn table nếu người dùng cần đối chiếu dữ liệu.

## Usage / Cách dùng

Dùng khi cần giữ ngữ cảnh danh sách. Admin nên dùng drawer cho order detail, customer detail, product quick edit.

## Do / Nên

- Giữ action bar cố định trong drawer dài.
- Cảnh báo khi đóng form chưa lưu.
- Dùng skeleton cho detail async.

## Don't / Không nên

- Không dùng drawer cho checkout chính.
- Không dùng drawer cho nội dung public SEO cần route riêng.
- Không đặt drawer bên trong modal.

