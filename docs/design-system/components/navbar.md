# Navbar / Thanh điều hướng

## Purpose / Mục đích

Navbar giúp người dùng truy cập nhanh storefront, search, cart, account và admin entry nếu có quyền.

## Variant / Biến thể

- Public Navbar: storefront.
- Customer Navbar: có account/cart/notification.
- Admin Topbar: search, account, quick action.
- Mobile Navbar: navigation rút gọn.

## Size / Kích thước

Standard cho desktop, compact cho mobile, admin topbar thấp hơn storefront nếu cần mật độ.

## State / Trạng thái

Default, sticky, active item, loading user, guest, authenticated, permission-based.

## Accessibility / Khả năng tiếp cận

Navigation item phải có text hoặc label. Cart/notification count cần đọc được ngoài màu.

## Responsive Rule / Quy tắc responsive

Mobile ưu tiên menu, search, cart và account. Item ít dùng chuyển vào menu/drawer.

## Usage / Cách dùng

Dùng cho public/customer storefront và admin topbar theo UI Contract navigation.

## Do / Nên

- Giữ search dễ thấy trên storefront.
- Hiển thị cart rõ.
- Dùng tiếng Việt cho label.

## Don't / Không nên

- Không để navbar che content khi sticky.
- Không nhồi quá nhiều link trên mobile.
- Không dùng navbar như hero marketing.

