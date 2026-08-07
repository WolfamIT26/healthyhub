# Shared UI Implementation Guide / Hướng dẫn triển khai Shared UI

## Usage / Cách dùng

Import từ `apps/web/src/components` hoặc file nhóm trực tiếp. Ưu tiên composition: `FormField` + control, `Modal` + footer actions, `Card` + nội dung do feature cung cấp. Component shared không gọi API, route hoặc business store.

## Form Standard / Chuẩn form

- Luôn có `Label`; dùng `required` để hiển thị dấu bắt buộc.
- Một thời điểm ưu tiên `error`, sau đó `success`, sau đó `helperText`.
- Control tự hỗ trợ disabled; submit dùng `Button loading`.
- Nối `aria-describedby` tới `${id}-error`, `${id}-success` hoặc `${id}-helper` khi trạng thái tương ứng cần được đọc.

## Responsive & Accessibility

- Control/action mặc định cao tối thiểu 44px; container có padding mobile.
- Modal tối đa `100dvh - 2rem`; Drawer tối đa viewport; Tabs/navigation có wrap hoặc horizontal overflow cục bộ, không làm page tràn ngang.
- Dùng keyboard, focus-visible, semantic role/label và text status; không truyền đạt bằng màu đơn độc.
- Motion 180ms, nhẹ và tắt bằng `motion-reduce`; loading liên tục dùng reduced-motion fallback.

## Do / Don't

- Do: dùng semantic token (`primary`, `error`, `neutral`) và shared primitive trước khi tạo component mới.
- Do: giữ text UI tiếng Việt, props/code naming tiếng Anh.
- Don't: hard-code màu khi token phù hợp đã có.
- Don't: đặt API call, permission, cart/checkout/product/admin logic trong shared component.
- Don't: sửa, xóa, đổi tên hoặc tạo asset trong Design System task.
