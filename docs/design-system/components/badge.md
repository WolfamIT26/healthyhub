# Badge / Nhãn trạng thái

## Purpose / Mục đích

Badge dùng để hiển thị trạng thái ngắn như còn hàng, hết hàng, đơn mới, đã thanh toán, VIP, AI cần duyệt hoặc mức cảnh báo.

## Variant / Biến thể

- Status: trạng thái nghiệp vụ.
- Role: vai trò hoặc tier.
- Count: số lượng nhỏ.
- AI: confidence, source, safety, review required.
- Promotion: ưu đãi hoặc campaign tag nổi bật.

## Size / Kích thước

Small cho table/caption, medium cho card/detail. Không dùng badge quá lớn như button.

## State / Trạng thái

Default, muted, success, warning, danger, info, AI assistive.

## Accessibility / Khả năng tiếp cận

Badge phải có text. Không dùng màu là tín hiệu duy nhất, nhất là với order/payment/inventory status.

## Responsive Rule / Quy tắc responsive

Mobile cho phép badge xuống dòng nếu tên trạng thái dài. Table compact cần ưu tiên trạng thái quan trọng nhất.

## Usage / Cách dùng

Dùng trong product card, order list, admin table, review moderation, loyalty và AI output.

## Do / Nên

- Dùng label tiếng Việt dễ hiểu.
- Mapping màu theo semantic status.
- Giữ badge ngắn.

## Don't / Không nên

- Không dùng badge cho hành động.
- Không hiển thị raw enum cho customer.
- Không dùng quá nhiều badge trên một card sản phẩm.

