# Screen Flow / Luồng màn hình

## Purpose / Mục tiêu

Tài liệu này mô tả luồng chuyển màn hình chính của HealthyHub để Frontend Development hiểu navigation và trạng thái người dùng trước khi triển khai.

## Public Shopping Flow / Luồng mua hàng public

| Step / Bước | From / Từ màn hình | To / Đến màn hình | Trigger / Kích hoạt |
| --- | --- | --- | --- |
| 1 | Home | Product List | Chọn xem sản phẩm/danh mục. |
| 2 | Product List | Product Detail | Chọn một sản phẩm. |
| 3 | Product Detail | Cart | Thêm vào giỏ hoặc xem giỏ. |
| 4 | Cart | Checkout | Bấm đặt hàng. |
| 5 | Checkout | Order Detail hoặc Success State | Tạo order thành công. |
| 6 | Checkout | Login/Register | Nếu policy yêu cầu đăng nhập. |

## Search Flow / Luồng tìm kiếm

| Step / Bước | From / Từ màn hình | To / Đến màn hình | Trigger / Kích hoạt |
| --- | --- | --- | --- |
| 1 | Header search/Home | Product List | Nhập keyword hoặc chọn filter. |
| 2 | Product List | Product List | Thay đổi search/filter/sort/page. |
| 3 | Product List | AI Assistant | Chọn tìm bằng AI nếu search thường không đủ. |
| 4 | AI Assistant | Product Detail | Chọn sản phẩm AI gợi ý. |

## Customer Account Flow / Luồng tài khoản khách hàng

| Step / Bước | From / Từ màn hình | To / Đến màn hình | Trigger / Kích hoạt |
| --- | --- | --- | --- |
| 1 | Login | Account Overview | Đăng nhập thành công. |
| 2 | Account Overview | Orders | Chọn đơn hàng. |
| 3 | Orders | Order Detail | Chọn một đơn. |
| 4 | Order Detail | Review Form | Đơn đủ điều kiện review. |
| 5 | Account Overview | Addresses/Wishlist/Loyalty/Notifications | Chọn mục account tương ứng. |

## Admin Operation Flow / Luồng vận hành admin

| Step / Bước | From / Từ màn hình | To / Đến màn hình | Trigger / Kích hoạt |
| --- | --- | --- | --- |
| 1 | Admin Dashboard | Orders | Chọn đơn cần xử lý. |
| 2 | Orders | Order Detail/Drawer | Chọn đơn. |
| 3 | Order Detail | Payment/Shipping screen | Cần kiểm tra thanh toán/giao hàng. |
| 4 | Order Detail | Inventory | Cần kiểm tra tồn kho. |
| 5 | Order Detail | Customer Detail | Cần chăm sóc khách. |

## Product Management Flow / Luồng quản lý sản phẩm

| Step / Bước | From / Từ màn hình | To / Đến màn hình | Trigger / Kích hoạt |
| --- | --- | --- | --- |
| 1 | Admin Products | Product Form | Tạo hoặc sửa sản phẩm. |
| 2 | Product Form | Media | Cần upload/gắn ảnh. |
| 3 | Product Form | Catalog | Cần tạo category/brand mới. |
| 4 | Product Form | Inventory | Cần kiểm tra khả năng bán. |
| 5 | Product Form | Admin Products | Lưu thành công hoặc hủy. |

## AI Flow / Luồng AI

| Step / Bước | From / Từ màn hình | To / Đến màn hình | Trigger / Kích hoạt |
| --- | --- | --- | --- |
| 1 | Product Detail/Product List | AI Assistant | Hỏi tư vấn hoặc tìm kiếm nâng cao. |
| 2 | AI Assistant | Product Detail | Chọn sản phẩm gợi ý. |
| 3 | Admin AI | Admin Promotions/Blog/Notifications | Dùng output marketing đã duyệt. |
| 4 | Admin Analytics | Admin AI | Yêu cầu AI phân tích insight. |

## Failure Flow / Luồng thất bại

- Auth expired: chuyển về Login và giữ intended route nếu an toàn.
- Permission denied: hiển thị error state và link quay lại màn hình hợp lệ.
- Order/payment/shipping lỗi: giữ người dùng ở màn hình hiện tại, hiển thị hướng xử lý.
- AI blocked: hiển thị safety message và không tự động gửi output vào màn hình khác.

