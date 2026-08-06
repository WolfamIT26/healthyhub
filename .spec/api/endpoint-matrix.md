# Endpoint Matrix / Ma trận endpoint

## Purpose / Mục tiêu

Endpoint Matrix tổng hợp các endpoint chính để dễ rà soát trước khi mở từng domain API specification.

## Matrix Rule / Quy tắc matrix

- Matrix này là bản tổng quan, chi tiết nằm trong từng file domain.
- Endpoint dùng `/api/v1`.
- Không tạo OpenAPI hoặc Swagger trong Prompt 10.
- Permission chi tiết có thể được diễn giải thêm ở file domain.

## Core Endpoint Matrix / Ma trận endpoint core

| Domain / Domain | Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực |
| --- | --- | --- | --- | --- |
| Authentication | POST | `/api/v1/auth/register` | Đăng ký tài khoản khách hàng | Public |
| Authentication | POST | `/api/v1/auth/login` | Đăng nhập | Public |
| Authentication | POST | `/api/v1/auth/refresh` | Refresh token | Refresh token |
| Authentication | POST | `/api/v1/auth/logout` | Đăng xuất | JWT |
| Product | GET | `/api/v1/public/products` | Xem danh sách sản phẩm public | Public |
| Product | GET | `/api/v1/public/products/{productId}` | Xem chi tiết sản phẩm public | Public |
| Product | GET | `/api/v1/admin/products` | Quản lý danh sách sản phẩm | Staff JWT |
| Product | POST | `/api/v1/admin/products` | Tạo sản phẩm | Staff JWT |
| Cart | GET | `/api/v1/cart` | Xem giỏ hàng | Guest token hoặc Customer JWT |
| Cart | POST | `/api/v1/cart/items` | Thêm item vào giỏ | Guest token hoặc Customer JWT |
| Order | POST | `/api/v1/orders` | Tạo đơn hàng từ checkout | Guest token hoặc Customer JWT |
| Order | GET | `/api/v1/me/orders` | Xem đơn hàng của tôi | Customer JWT |
| Order | GET | `/api/v1/admin/orders` | Quản lý đơn hàng | Staff JWT |
| Payment | POST | `/api/v1/payments/intents` | Tạo yêu cầu thanh toán | Customer JWT |
| Shipping | POST | `/api/v1/shipping/quotes` | Tính phí/ước lượng giao hàng | Public hoặc Customer JWT |
| Media | POST | `/api/v1/media/uploads/prepare` | Chuẩn bị upload file | JWT |
| AI | POST | `/api/v1/ai/chat` | Chat AI hỗ trợ khách | Optional hoặc Customer JWT |
| Analytics | GET | `/api/v1/admin/analytics/dashboard` | Dashboard quản trị | Staff JWT |
| Settings | GET | `/api/v1/public/settings/storefront` | Cấu hình storefront public | Public |

## Full Domain Detail / Chi tiết đầy đủ

Mở [Domain API Specifications](domains/README.md) để xem endpoint list đầy đủ theo từng domain, gồm permission, request contract, response contract, error contract, validation, pagination, filter, search, sort, upload/download, rate limit, idempotency, webhook và AI endpoint.

