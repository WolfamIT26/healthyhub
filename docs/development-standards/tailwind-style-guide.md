# Tailwind Style Guide / Chuẩn Tailwind

## Purpose / Mục tiêu

Tailwind CSS là công cụ styling chính cho Web ở phase implementation. Tài liệu này chỉ quy định cách dùng Tailwind, không viết CSS hoặc class implementation.

## Token Alignment / Bám Design Token

- Tailwind theme phải map từ Design Token khi implementation bắt đầu.
- Không dùng màu tùy tiện nếu đã có token trong Design System.
- Spacing, radius, shadow, breakpoint và typography phải bám `docs/design-system`.
- Dark mode dùng semantic mapping, không đảo màu thủ công từng component.

## Class Usage Rule / Quy tắc dùng class

- Ưu tiên utility rõ ràng và dễ đọc.
- Component dùng chung nên ẩn chi tiết style sau API component ổn định.
- Không copy nguyên cụm class dài giữa nhiều component nếu có pattern lặp thật sự.
- Không hardcode giá trị màu hoặc spacing ngoài token nếu không có lý do.

## Responsive Rule / Quy tắc responsive

- Mobile-first.
- Product card, checkout, table và modal phải có behavior theo UI Contract.
- Admin table trên mobile cần compact pattern thay vì ép ngang nếu khó dùng.

## State Styling / Style theo trạng thái

- Loading, disabled, focus, error, success, warning và danger phải có style rõ.
- Focus state phải đủ rõ cho keyboard.
- Error state không chỉ dựa vào màu đỏ, phải có text.

## Prohibited / Không được làm

- Không tạo design mới trái Design System.
- Không dùng class ngẫu nhiên làm phá palette.
- Không dùng animation trang trí quá mức trong admin.
- Không viết CSS custom nếu Tailwind và token đã đáp ứng, trừ khi có lý do rõ.

