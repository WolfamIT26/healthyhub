# Empty State / Trạng thái rỗng

## Purpose / Mục đích

Empty State giải thích vì sao không có dữ liệu và đề xuất bước tiếp theo cho người dùng.

## Variant / Biến thể

- No Data: chưa có dữ liệu.
- No Search Result: không có kết quả theo search/filter.
- Empty Cart: giỏ hàng trống.
- Empty Admin List: chưa có dữ liệu quản trị.
- Empty AI Source: AI chưa có nguồn phù hợp.

## Size / Kích thước

Inline cho vùng nhỏ, section cho danh sách lớn, page-level cho màn hình không có dữ liệu chính.

## State / Trạng thái

Default, with action, with secondary action, permission-limited.

## Accessibility / Khả năng tiếp cận

Thông điệp phải rõ bằng text. Illustration nếu có chỉ hỗ trợ, không thay thế nội dung.

## Responsive Rule / Quy tắc responsive

Mobile empty state ngắn, action dễ bấm và không chiếm quá nhiều chiều cao.

## Usage / Cách dùng

Dùng cho danh sách sản phẩm rỗng, cart rỗng, admin list chưa có dữ liệu, AI thiếu nguồn.

## Do / Nên

- Phân biệt chưa có dữ liệu và không có kết quả lọc.
- Đưa action tiếp theo nếu user có quyền.
- Viết tiếng Việt thân thiện, cụ thể.

## Don't / Không nên

- Không dùng thông điệp chung chung như "Không có gì".
- Không đưa action tạo mới nếu user không có quyền.
- Không dùng empty state cho lỗi API.

