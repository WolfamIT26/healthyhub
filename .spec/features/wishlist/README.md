# Wishlist Feature Specification / Đặc tả tính năng yêu thích

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1 |
| Dependency | Authentication, Products, Customers |
| Version | Version 1 |
| Owner | Product Owner |
| Status | Executable V1 — implemented in Prompt 30 |

## Overview / Tổng quan

Wishlist cho phép khách lưu sản phẩm quan tâm để xem lại hoặc mua sau.

## Business Goal / Mục tiêu kinh doanh

Tăng khả năng quay lại mua hàng, hỗ trợ cá nhân hóa và tạo tín hiệu cho recommendation sau này.

## Scope / Phạm vi

Trong phạm vi V1 executable: persistence private owner-only, list/add/remove, duplicate protection và UI server sync. Wishlist sharing, notification, recommendation và AI ngoài phạm vi Prompt 30.

## Requirement / Yêu cầu

- Customer có thể thêm sản phẩm public vào wishlist.
- Customer có thể xóa sản phẩm khỏi wishlist.
- Wishlist chỉ hiển thị cho chính khách hàng.
- Sản phẩm hết hàng vẫn có thể lưu nhưng phải hiển thị trạng thái.

## User Story / User story

- Là Customer, tôi muốn lưu sản phẩm quan tâm để mua sau.
- Là VIP Customer, tôi muốn nhận gợi ý từ sản phẩm đã yêu thích.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Add favorite | Customer | Sản phẩm được lưu. |
| Remove favorite | Customer | Sản phẩm bị xóa khỏi danh sách. |
| View wishlist | Customer | Khách xem sản phẩm đã lưu. |

## Business Flow / Luồng nghiệp vụ

1. Customer xem sản phẩm.
2. Customer chọn lưu yêu thích.
3. Hệ thống kiểm tra sản phẩm hợp lệ.
4. Sản phẩm được đưa vào wishlist cá nhân.
5. Customer xem lại và chuyển sang cart khi muốn mua.

## Validation Rule / Quy tắc validation

- Chỉ user đã đăng nhập được lưu wishlist.
- Không lưu trùng cùng một sản phẩm.
- Sản phẩm bị ẩn cần hiển thị trạng thái phù hợp hoặc không còn khả dụng.

## Permission / Phân quyền

Customer/Member/VIP quản lý wishlist của chính mình. Staff/Admin không xem wishlist cá nhân nếu không có policy.

## Acceptance Criteria / Tiêu chí hoàn thành

- Customer lưu và xóa sản phẩm yêu thích.
- Wishlist không trùng sản phẩm.
- Wishlist phản ánh trạng thái sản phẩm hiện tại.
- Reload/login lại cùng Customer vẫn đọc đúng membership từ server.

## Edge Cases / Trường hợp biên

- Sản phẩm bị ngừng bán sau khi lưu.
- Customer lưu quá nhiều sản phẩm.
- Sản phẩm đổi tên hoặc hình ảnh.

## Error Cases / Trường hợp lỗi

- Chưa đăng nhập.
- Sản phẩm không tồn tại.
- Sản phẩm không được phép lưu.

## Future Enhancement / Mở rộng tương lai

- Wishlist sharing.
- Price drop notification.
- AI recommendation từ wishlist khi có contract/consent riêng.

## Persistence Authority / Authority persistence

- Một default private Wishlist được tạo lazy cho active CustomerProfile.
- Customer owner derive từ JWT; client không gửi `customerId`.
- Membership nằm trong MySQL; Product/Inventory cung cấp tên, giá và availability hiện hành.
- Logout chỉ clear client state, không xóa Wishlist server; account switch remount state theo actor.
