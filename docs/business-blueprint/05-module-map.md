# Module Map / Bản đồ module

## Overview / Tổng quan

Module Map chuyển các domain nghiệp vụ thành nhóm module có thể quản lý trong Modular Monolith. Đây là bản đồ nghiệp vụ, chưa phải thiết kế source code.

## Module Classification / Phân loại module

| Module / Module | Type / Loại | Domains Covered / Domain phụ trách | Priority / Ưu tiên |
| --- | --- | --- | --- |
| Authentication | Core | Đăng ký, đăng nhập, phiên người dùng. | MVP |
| Users & Permissions | Core | User role, permission, admin access. | MVP |
| Products | Core | Product, Category, Brand, Media liên quan sản phẩm. | MVP |
| Inventory | Core | Inventory, stock alert, availability. | MVP |
| Cart | Core | Cart, coupon validation ở mức đặt hàng. | MVP |
| Orders | Core | Order lifecycle, order status, cancellation. | MVP |
| Payment | Core | Payment status, payment method, refund policy sau này. | Version 1 |
| Shipping | Core | Shipping info, delivery status, shipping fee policy. | Version 1 |
| Customers | Core | Customer profile, segmentation, support history. | Version 1 |
| Promotion | Supporting | Coupon, promotion campaign, voucher. | Version 1 |
| Loyalty | Supporting | Member, VIP, points, tiers. | Version 1.5 |
| Reviews | Supporting | Product review, moderation. | Version 1 |
| Blog & Content | Supporting | Blog, SEO content, education content. | Version 1 |
| Notifications | Supporting | Email, SMS, Zalo, in-app notification policy. | Version 1 |
| AI Platform | Cross-cutting | AI chat, recommendation, search, compare, nutrition, marketing, analytics. | Version 1.5 |
| Analytics | Cross-cutting | Sales, customer, inventory, marketing, AI analytics. | Version 1.5 |
| Settings | Core | Store settings, platform settings, SaaS readiness. | MVP |
| Media | Supporting | Upload, product images, certificates, banners. | MVP |

## Dependency Map / Bản đồ phụ thuộc

| Module / Module | Depends On / Phụ thuộc | Notes / Ghi chú |
| --- | --- | --- |
| Products | Media, Categories, Brands | Product cần media và phân loại trước khi bán. |
| Inventory | Products | Tồn kho gắn với sản phẩm có thể bán. |
| Cart | Products, Inventory, Promotion | Giỏ hàng cần kiểm tra sản phẩm, khả năng bán và ưu đãi. |
| Orders | Cart, Customers, Inventory, Payment, Shipping | Đơn hàng là module điều phối nghiệp vụ mua hàng. |
| Payment | Orders | Thanh toán theo đơn hàng. |
| Shipping | Orders, Customers | Giao hàng cần thông tin đơn và người nhận. |
| Promotion | Products, Customers | Ưu đãi có thể phụ thuộc sản phẩm hoặc nhóm khách. |
| Loyalty | Customers, Orders | Điểm và cấp bậc dựa trên hành vi mua hợp lệ. |
| Reviews | Customers, Products, Orders | Review nên gắn với trải nghiệm mua hàng. |
| AI Platform | Products, Customers, Orders, Knowledge, Analytics | AI dùng dữ liệu có kiểm soát, không sở hữu dữ liệu gốc. |
| Analytics | Orders, Products, Inventory, Customers, Promotion | Analytics tổng hợp, không sửa dữ liệu vận hành. |

## SaaS Readiness / Chuẩn bị SaaS

- Settings phải được thiết kế để phân biệt cấu hình cửa hàng và cấu hình nền tảng.
- Super Admin là vai trò chuẩn bị cho quản lý nhiều cửa hàng.
- Module phải tránh phụ thuộc cứng vào một cửa hàng duy nhất.
- Analytics và AI Platform cần chuẩn bị khả năng lọc theo cửa hàng trong tương lai.

