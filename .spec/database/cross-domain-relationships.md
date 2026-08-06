# Cross Domain Relationships / Quan hệ dữ liệu liên Domain

## Purpose / Mục tiêu

Tài liệu này mô tả quan hệ dữ liệu chính giữa các domain để chuẩn bị Physical Database Design và API Specification.

## Relationship Matrix / Ma trận quan hệ

| Source / Nguồn | Target / Đích | Cardinality / Số lượng | Relationship / Quan hệ |
| --- | --- | --- | --- |
| Customer | User | 1-1 hoặc 0-1 | Một hồ sơ khách có thể gắn với một user account; guest checkout có thể chưa có user. |
| Staff | User | 1-1 | Một staff profile gắn với một user account nội bộ. |
| User | Role | N-N | User có nhiều role, role có nhiều user qua assignment. |
| Role | Permission | N-N | Role gom nhiều permission qua association entity. |
| Product | Category | N-N | Sản phẩm có thể thuộc nhiều danh mục; một danh mục có nhiều sản phẩm. |
| Product | Brand | N-1 | Nhiều sản phẩm có thể thuộc một brand. |
| Product | Media | N-N | Sản phẩm có nhiều media, media có thể dùng lại có kiểm soát. |
| Brand | Media | N-N | Brand có certificate/logo/media riêng. |
| Inventory | Product | 1-1 hoặc N-1 | Mỗi product có một inventory item chính ở MVP; tương lai multi-location có thể N inventory item. |
| Cart | Customer | N-1 hoặc guest session | Một customer có thể có nhiều cart theo lifecycle; cart active thường chỉ một. |
| CartItem | Product | N-1 | Một cart item tham chiếu một product. |
| Wishlist | Customer | N-1 | Một customer có thể có nhiều wishlist theo tương lai. |
| WishlistItem | Product | N-1 | Wishlist lưu tham chiếu product. |
| Order | Customer | N-1 | Một customer có nhiều order. |
| OrderItem | Product | N-1 | Order item giữ product reference và snapshot để bảo toàn lịch sử. |
| Order | Payment | 1-N | Một order có thể có nhiều payment attempt hoặc payment record theo lifecycle. |
| Order | Shipment | 1-N | Một order có thể có nhiều shipment nếu tách giao hàng sau này. |
| CouponUsage | Order | N-1 | Coupon usage ghi nhận coupon đã áp vào order. |
| Promotion | Coupon | 1-N hoặc N-N | Promotion có thể phát hành nhiều coupon; coupon có thể liên kết campaign. |
| LoyaltyAccount | Customer | 1-1 | Mỗi customer có một loyalty account khi tham gia. |
| LoyaltyTransaction | Order | N-1 | Điểm phát sinh hoặc điều chỉnh theo order hợp lệ. |
| Review | Customer/Product/Order | N-1 | Review gắn với khách, sản phẩm và có thể tham chiếu order xác thực. |
| Blog | Product | N-N | Blog có thể liên kết sản phẩm liên quan. |
| NotificationRequest | Customer/User/Order | N-1 | Thông báo tham chiếu người nhận và ngữ cảnh nghiệp vụ. |
| AIInteraction | Customer/User | N-1 hoặc nullable | AI interaction có thể từ guest hoặc user đã đăng nhập. |
| AIInteraction | Product/Order/Media/Blog | N-1 hoặc nullable | AI lưu context reference, không sở hữu dữ liệu nguồn. |
| AnalyticsReport | Source Domains | Read-only reference | Analytics tổng hợp theo snapshot và period. |
| StoreSettings | Tenant | 1-1 | Mỗi tenant/cửa hàng có profile cấu hình riêng trong tương lai. |

## Cross Boundary Rule / Quy tắc qua boundary

- Không cascade delete dữ liệu vận hành quan trọng qua domain khác ở mức logical.
- Khi domain nguồn bị soft delete, domain tham chiếu phải giữ snapshot hoặc chuyển sang trạng thái không khả dụng.
- Dữ liệu nhạy cảm giữa Customer, AI, Analytics và Marketing phải tuân thủ consent/privacy policy.
- Quan hệ nhiều-nhiều phải có association entity để lưu audit, trạng thái và thời gian hiệu lực khi cần.
