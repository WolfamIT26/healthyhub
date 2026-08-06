# Sidebar / Thanh bên

## Purpose / Mục đích

Sidebar dùng cho admin/staff navigation để truy cập dashboard, orders, products, inventory, customers, analytics, AI và settings.

## Variant / Biến thể

- Admin Sidebar: navigation chính.
- Collapsed Sidebar: desktop hẹp.
- Mobile Drawer Sidebar: mobile/tablet.
- Context Sidebar: panel phụ nếu cần.

## Size / Kích thước

Expanded cho desktop, collapsed cho màn hình trung bình, drawer cho mobile.

## State / Trạng thái

Expanded, collapsed, active item, disabled item, permission-hidden item, loading permissions.

## Accessibility / Khả năng tiếp cận

Item cần label rõ. Icon-only collapsed state cần tooltip hoặc accessible label ở phase frontend.

## Responsive Rule / Quy tắc responsive

Mobile sidebar chuyển thành drawer hoặc menu, không chiếm chiều ngang cố định.

## Usage / Cách dùng

Dùng cho admin/staff, không dùng làm navigation chính của storefront.

## Do / Nên

- Nhóm item theo vận hành.
- Ẩn item không có quyền nhưng vẫn để backend kiểm quyền.
- Highlight route hiện tại.

## Don't / Không nên

- Không nhồi marketing banner vào sidebar admin.
- Không đổi vị trí item chính thường xuyên.
- Không dùng icon khó hiểu nếu sidebar collapsed.

