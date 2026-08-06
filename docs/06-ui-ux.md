# UI/UX / Giao diện và trải nghiệm

## Language / Ngôn ngữ giao diện

Giao diện người dùng dùng tiếng Việt.

## Product Direction / Định hướng trải nghiệm

HealthyHub cần tạo cảm giác tin cậy, sạch, dễ mua hàng và dễ hiểu thông tin dinh dưỡng. Thiết kế ưu tiên khả năng đọc, tìm kiếm, so sánh sản phẩm và hoàn tất đơn hàng.

## UI Contract / Hợp đồng UI

UI Contract nằm tại `.spec/ui-contract`. Đây là tài liệu mô tả màn hình, route, quyền, API cần dùng, dữ liệu cần hiển thị, component mapping, form, validation, trạng thái UI, responsive, accessibility và SEO metadata trước khi thiết kế giao diện hoặc viết frontend.

Prompt 11 chỉ tạo UI Contract, chưa thiết kế giao diện đẹp, chưa tạo Figma và chưa viết React/HTML/CSS.

## Design Rule / Quy tắc thiết kế

- Không dùng text tiếng Anh trên giao diện người dùng nếu không cần thiết.
- Luồng mua hàng phải ngắn và rõ.
- Thông tin dinh dưỡng cần dễ quét.
- Thành phần UI phải responsive.
- Trạng thái loading, empty, error và success phải có thiết kế.

## Design System / Hệ thống thiết kế

Design System nằm tại `docs/design-system`. Đây là tài liệu chuẩn cho principles, token, màu, chữ, spacing, radius, elevation, shadow, grid, breakpoint, icon, illustration, motion, dark mode, accessibility và component library.

Prompt 12 chỉ tạo tài liệu Design System, chưa viết React, chưa viết CSS, chưa tạo Figma và chưa tạo UI mockup.

## Accessibility / Khả năng tiếp cận

- Text phải đủ tương phản.
- Form phải có label rõ.
- Button phải có trạng thái disabled khi không hợp lệ.
- Không phụ thuộc chỉ vào màu sắc để truyền đạt trạng thái.
