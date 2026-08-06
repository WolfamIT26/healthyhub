# Button / Nút bấm

## Purpose / Mục đích

Button dùng để kích hoạt hành động rõ ràng như thêm vào giỏ, đặt hàng, lưu thay đổi, hủy đơn, gửi thông báo hoặc chạy AI.

## Variant / Biến thể

- Primary: hành động chính trên màn hình.
- Secondary: hành động phụ có cùng ngữ cảnh.
- Tertiary: hành động nhẹ, ít ưu tiên.
- Danger: xóa, hủy, khóa, refund hoặc thao tác rủi ro.
- Ghost: action trong toolbar hoặc table row.
- Icon-only: action phổ biến có icon rõ nghĩa và label hỗ trợ ở phase frontend.

## Size / Kích thước

- Small: table row action, toolbar phụ.
- Medium: form action mặc định.
- Large: CTA mua hàng hoặc checkout.

## State / Trạng thái

Default, hover, focus, active, disabled, loading, destructive confirmation pending.

## Accessibility / Khả năng tiếp cận

Button phải có label rõ. Icon-only button cần accessible label. Disabled state phải có lý do nếu hành động bị chặn lâu.

## Responsive Rule / Quy tắc responsive

Mobile ưu tiên full-width cho CTA chính trong checkout/cart. Admin toolbar có thể giữ button nhỏ nhưng không được làm vùng bấm quá hẹp.

## Usage / Cách dùng

Dùng một primary button chính cho mỗi vùng quyết định. Hành động nguy hiểm dùng danger và thường đi cùng Modal confirmation.

## Do / Nên

- Dùng text tiếng Việt ngắn, cụ thể.
- Hiển thị loading khi submit.
- Giữ thứ tự primary, secondary, cancel nhất quán.

## Don't / Không nên

- Không dùng nhiều primary button cạnh nhau.
- Không dùng ghost button cho hành động nguy hiểm.
- Không để text button dài làm vỡ layout.

