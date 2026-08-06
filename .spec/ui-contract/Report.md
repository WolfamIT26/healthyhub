# UI Contract Report / Báo cáo UI Contract

## Purpose / Mục tiêu

Báo cáo này tổng hợp kết quả Prompt 11: Generate UI Contract Specification.

## Summary / Tóm tắt

Đã tạo bộ UI Contract tại `.spec/ui-contract` dựa trên Business Blueprint, Data Contract và API Specification.

Bộ tài liệu bao gồm:

- UI Contract Standards.
- Navigation cho Public, Customer, Staff và Admin.
- Screen Flow.
- Component Mapping.
- UI State Contract.
- 32 screen contract chính.

## Screen Coverage / Mức bao phủ màn hình

| Group / Nhóm | Count / Số lượng | Coverage / Bao phủ |
| --- | --- | --- |
| Public | 6 | Home, Product List, Product Detail, Blog List, Blog Detail, AI Assistant. |
| Authentication | 3 | Login, Register, Forgot Password/Reset Password. |
| Customer | 9 | Cart, Checkout, Profile, Orders, Order Detail, Wishlist, Loyalty, Notifications, Reviews. |
| Admin/Staff | 14 | Dashboard, Product, Catalog, Media, Inventory, Order, Payment/Shipping, Customer, Promotion/Coupon, Content, Notification, Analytics, AI, User/Staff/Settings. |

## Design Decisions / Quyết định thiết kế

| Decision / Quyết định | Reason / Lý do |
| --- | --- |
| Tách `.spec/ui-contract` khỏi design system | UI Contract chỉ mô tả màn hình và hành vi, chưa quyết định visual style. |
| Dùng screen group thay vì từng modal nhỏ | Giữ tài liệu đủ rõ nhưng không phân mảnh quá mức trước frontend design. |
| Route frontend dùng pattern public/account/admin | Bám API namespace public/me/admin và user journey. |
| Mỗi màn hình có đủ state contract | Đảm bảo frontend sau này không bỏ sót loading, empty, error, success, toast và confirmation. |
| AI screen có safety/source/confidence | Bám AI Response Contract và yêu cầu AI toàn hệ thống. |

## Boundary / Ranh giới

Prompt 11 chỉ tạo UI Contract. Các quyết định về visual design, layout chi tiết, component implementation, responsive CSS, React state management và Figma thuộc prompt sau.

## Assumptions / Giả định

- Frontend route có thể khác URI API nhưng phải giữ mapping rõ.
- Một số admin route gom nhiều domain liên quan để tối ưu vận hành, ví dụ Payment/Shipping và Promotions/Coupons.
- Reset Password được gom trong Forgot Password screen contract vì cùng một recovery flow.

