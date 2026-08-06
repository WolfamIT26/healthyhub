# Domain API Map / Bản đồ API theo domain

## Purpose / Mục tiêu

Domain API Map cho biết mỗi domain có API namespace, nhóm quyền, contract và khả năng tách service tương lai như thế nào.

## API Domain Map / Bảng domain API

| Domain / Domain | Namespace / Namespace | Audience / Đối tượng | Permission / Quyền chính | Contract Reference / Contract tham chiếu |
| --- | --- | --- | --- | --- |
| Authentication | `/api/v1/auth` | Guest, customer, staff | Public, auth self | Authentication request/response, auth errors |
| User | `/api/v1/admin/users` | Admin, super admin | `users:read`, `users:manage` | User summary/detail, role summary |
| Customer | `/api/v1/me`, `/api/v1/admin/customers` | Customer, staff, manager, admin | `customers:read`, `customers:manage` | Customer profile/detail |
| Staff | `/api/v1/admin/staff` | Admin, super admin | `staff:read`, `staff:manage` | Staff summary/detail |
| Product | `/api/v1/public/products`, `/api/v1/admin/products` | Guest, customer, staff/admin | `products:read`, `products:manage` | Product list/detail |
| Category | `/api/v1/public/categories`, `/api/v1/admin/categories` | Guest, customer, staff/admin | `categories:read`, `categories:manage` | Category tree/detail |
| Brand | `/api/v1/public/brands`, `/api/v1/admin/brands` | Guest, customer, staff/admin | `brands:read`, `brands:manage` | Brand summary/detail |
| Inventory | `/api/v1/admin/inventory` | Staff, manager, admin | `inventory:read`, `inventory:adjust` | Stock summary, movement summary |
| Cart | `/api/v1/cart` | Guest, customer | Cart owner | Cart detail, price summary |
| Wishlist | `/api/v1/me/wishlist` | Customer, member, VIP | Wishlist owner | Wishlist item list |
| Order | `/api/v1/me/orders`, `/api/v1/admin/orders` | Customer, staff/admin | `orders:read`, `orders:process` | Order summary/detail/timeline |
| Payment | `/api/v1/payments`, `/api/v1/admin/payments` | Customer, staff/admin, provider | `payments:read`, `payments:refund` | Payment summary/status |
| Shipping | `/api/v1/shipping`, `/api/v1/admin/shipments` | Customer, staff/admin, provider | `shipping:read`, `shipping:manage` | Shipping summary/tracking |
| Coupon | `/api/v1/coupons`, `/api/v1/admin/coupons` | Guest/customer, manager/admin | `coupons:manage` | Coupon validation/summary |
| Promotion | `/api/v1/public/promotions`, `/api/v1/admin/promotions` | Guest/customer, manager/admin | `promotions:manage` | Promotion summary/detail |
| Loyalty | `/api/v1/me/loyalty`, `/api/v1/admin/loyalty` | Member/VIP, manager/admin | `loyalty:read`, `loyalty:manage` | Point balance/transaction |
| Review | `/api/v1/public/reviews`, `/api/v1/me/reviews`, `/api/v1/admin/reviews` | Guest/customer, staff/admin | `reviews:moderate` | Review list/detail |
| Blog | `/api/v1/public/blog-posts`, `/api/v1/admin/blog-posts` | Guest/customer, staff/admin | `blog:manage` | Blog card/detail |
| Media | `/api/v1/media`, `/api/v1/admin/media` | Customer, staff/admin | `media:upload`, `media:manage` | Media asset, file transfer |
| Notification | `/api/v1/me/notifications`, `/api/v1/admin/notifications` | Customer, staff/admin, provider | `notifications:send`, `notifications:manage` | Notification summary/delivery |
| Analytics | `/api/v1/admin/analytics` | Staff limited, manager/admin | `analytics:read`, `analytics:export` | Metric summary/dashboard dataset |
| AI | `/api/v1/ai`, `/api/v1/admin/ai` | Customer, staff/admin | `ai:use`, `ai:review`, `ai:admin` | AI response/source/safety |
| Settings | `/api/v1/public/settings`, `/api/v1/admin/settings` | Guest/customer, admin/super admin | `settings:read`, `settings:manage` | Setting summary/value |

## Future Service Boundary / Ranh giới service tương lai

| Candidate / Ứng viên tách service | API Rule / Quy tắc API |
| --- | --- |
| Payment | Webhook và refund phải idempotent, không lộ provider internals. |
| Shipping | Tracking API tách khỏi order bằng shipping summary contract. |
| Notification | Delivery status và provider callback đi qua notification contract. |
| AI | AI endpoint dùng source reference và safety metadata, không đọc trực tiếp contract nội bộ của domain khác. |
| Analytics | API trả aggregate/dataset, không trả raw operational data mặc định. |
| Media | Upload/download dùng file transfer contract, không trả storage key public. |

