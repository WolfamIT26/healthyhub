# Navigation / Điều hướng UI

## Purpose / Mục tiêu

Tài liệu này định nghĩa navigation cho Public, Customer, Staff và Admin. Navigation chỉ mô tả cấu trúc và quyền hiển thị, không thiết kế visual.

## Public Navigation / Điều hướng public

| Item / Mục | Route / Route | Visibility / Hiển thị | Purpose / Mục tiêu |
| --- | --- | --- | --- |
| Trang chủ | `/` | Guest và mọi user | Vào storefront và xem điểm nổi bật. |
| Sản phẩm | `/products` | Guest và mọi user | Duyệt/tìm/lọc sản phẩm. |
| Danh mục | `/products?categoryId=` | Guest và mọi user | Vào sản phẩm theo danh mục. |
| Khuyến mãi | `/promotions` | Guest và mọi user | Xem promotion public. |
| Blog | `/blog` | Guest và mọi user | Đọc nội dung healthy/SEO. |
| AI hỗ trợ | `/ai` | Guest hoặc customer theo policy | Chat/search/gợi ý public-safe. |
| Giỏ hàng | `/cart` | Guest/customer | Xem và chỉnh giỏ. |
| Đăng nhập | `/login` | Guest | Đăng nhập tài khoản. |

## Customer Navigation / Điều hướng customer

| Item / Mục | Route / Route | Visibility / Hiển thị | Purpose / Mục tiêu |
| --- | --- | --- | --- |
| Tài khoản | `/account` | Customer/member/VIP | Hồ sơ và thông tin cá nhân. |
| Địa chỉ | `/account/addresses` | Customer/member/VIP | Quản lý địa chỉ nhận hàng. |
| Đơn hàng | `/account/orders` | Customer/member/VIP | Theo dõi lịch sử đơn. |
| Yêu thích | `/account/wishlist` | Customer/member/VIP | Sản phẩm đã lưu. |
| Điểm thưởng | `/account/loyalty` | Member/VIP | Xem điểm và tier. |
| Thông báo | `/account/notifications` | Customer/member/VIP | Xem notification cá nhân. |
| Đánh giá | `/account/reviews` | Customer/member/VIP | Quản lý review của tôi. |

## Staff Navigation / Điều hướng staff

| Item / Mục | Route / Route | Visibility / Hiển thị | Purpose / Mục tiêu |
| --- | --- | --- | --- |
| Dashboard | `/admin` | Staff limited trở lên | Xem tổng quan vận hành. |
| Đơn hàng | `/admin/orders` | Staff/manager/admin | Xử lý đơn hàng. |
| Sản phẩm | `/admin/products` | Staff limited trở lên | Quản lý sản phẩm theo quyền. |
| Tồn kho | `/admin/inventory` | Staff limited trở lên | Theo dõi và điều chỉnh tồn kho. |
| Khách hàng | `/admin/customers` | Staff limited trở lên | Hỗ trợ/chăm sóc khách hàng. |
| Blog/Review | `/admin/content` | Staff limited trở lên | Quản lý nội dung và review theo quyền. |

## Admin Navigation / Điều hướng admin

| Item / Mục | Route / Route | Visibility / Hiển thị | Purpose / Mục tiêu |
| --- | --- | --- | --- |
| Media | `/admin/media` | Manager/admin | Quản lý file, ảnh, chứng nhận. |
| Coupon/Promotion | `/admin/promotions` | Manager/admin | Quản lý ưu đãi và mã giảm giá. |
| Payment/Shipping | `/admin/operations` | Manager/admin | Theo dõi thanh toán và giao hàng. |
| Notification | `/admin/notifications` | Manager/admin | Gửi và theo dõi thông báo. |
| Analytics | `/admin/analytics` | Staff limited/manager/admin | Báo cáo kinh doanh/vận hành. |
| AI | `/admin/ai` | Manager/admin có quyền AI | Review AI, marketing AI, analytics AI. |
| Users/Staff | `/admin/users` | Admin/super admin | Quản lý user, staff, role. |
| Settings | `/admin/settings` | Admin/super admin | Cấu hình cửa hàng và policy. |

## Navigation Rule / Quy tắc điều hướng

- UI có thể ẩn mục không có quyền, nhưng backend vẫn phải kiểm tra quyền.
- Public navigation ưu tiên tìm sản phẩm, danh mục, giỏ hàng và tài khoản.
- Admin navigation ưu tiên đơn hàng, sản phẩm, tồn kho và cảnh báo vận hành.
- Mobile navigation cần rút gọn thành bottom navigation hoặc drawer ở bước thiết kế frontend sau, chưa quyết định visual tại Prompt 11.

