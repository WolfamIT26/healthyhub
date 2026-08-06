# Toast / Thông báo nhanh

## Purpose / Mục đích

Toast thông báo kết quả ngắn sau hành động như thêm vào giỏ, lưu form, gửi thông báo, cập nhật trạng thái hoặc lỗi tạm thời.

## Variant / Biến thể

- Success: hành động thành công.
- Error: lỗi cần biết nhưng không nhất thiết chặn toàn màn hình.
- Warning: điều kiện cần chú ý.
- Info: job đang xử lý hoặc thông tin nền.
- AI: output cần duyệt hoặc AI thiếu nguồn.

## Size / Kích thước

Default cho đa số trường hợp. Compact cho admin dense view nếu message ngắn.

## State / Trạng thái

Entering, visible, dismissing, persistent, action available.

## Accessibility / Khả năng tiếp cận

Toast phải có text rõ và không chỉ dùng màu. Lỗi quan trọng trong form không chỉ hiển thị bằng toast mà cần hiển thị cạnh field.

## Responsive Rule / Quy tắc responsive

Mobile toast không che CTA checkout/cart. Nếu nhiều toast, stack không làm mất khả năng thao tác chính.

## Usage / Cách dùng

Dùng cho phản hồi không cần chiếm toàn màn hình. Action quan trọng vẫn cần cập nhật trạng thái trong nội dung chính.

## Do / Nên

- Viết message ngắn, cụ thể.
- Cho phép đóng nếu toast kéo dài.
- Gắn action nếu có bước xử lý nhanh.

## Don't / Không nên

- Không dùng toast thay confirmation.
- Không dùng toast cho thông tin lỗi validation nhiều field.
- Không để toast biến mất quá nhanh với lỗi quan trọng.

