# Domain Data Map / Bản đồ dữ liệu Domain

## Purpose / Mục tiêu

Domain Data Map mô tả mỗi domain sở hữu nhóm dữ liệu nào ở mức logical. Tài liệu này giúp tránh trộn dữ liệu giữa các module trong Modular Monolith.

## Data Ownership Map / Bản đồ sở hữu dữ liệu

| Domain / Domain | Owned Logical Entities / Entity sở hữu | Referenced Domains / Domain tham chiếu |
| --- | --- | --- |
| Authentication | `authentication_sessions`, `login_attempts`, `password_reset_requests`, `account_verifications` | User, Notification, Settings |
| User | `user_accounts`, `roles`, `permissions`, `role_permissions`, `user_role_assignments`, `permission_grants`, `user_status_histories` | Settings |
| Customer | `customer_profiles`, `customer_addresses`, `customer_segments`, `support_notes` | User, Authentication |
| Staff | `staff_profiles`, `staff_assignments`, `operational_permissions`, `staff_activities` | User, Order, Inventory, Customer |
| Product | `products`, `product_contents`, `product_ingredients`, `product_media_links` | Category, Brand, Media |
| Category | `categories`, `category_display_rules`, `product_category_links` | Product |
| Brand | `brands`, `brand_certificates`, `brand_media_links` | Media, Product |
| Inventory | `inventory_items`, `stock_adjustments`, `stock_alerts`, `stock_reservations` | Product, Order |
| Cart | `carts`, `cart_items`, `applied_cart_coupons` | Customer, Product, Inventory, Coupon |
| Wishlist | `wishlists`, `wishlist_items` | Customer, Product |
| Order | `orders`, `order_items`, `order_status_histories`, `order_cancellations` | Cart, Customer, Inventory, Payment, Shipping, Coupon, Promotion |
| Payment | `payments`, `payment_attempts`, `refund_requests`, `payment_status_histories` | Order, Settings |
| Shipping | `shipments`, `shipping_addresses`, `delivery_attempts`, `shipping_status_histories` | Order, Customer, Settings |
| Coupon | `coupons`, `coupon_conditions`, `coupon_usages`, `coupon_campaign_links` | Promotion, Customer, Product |
| Promotion | `promotions`, `promotion_conditions`, `promotion_schedules`, `promotion_targets` | Product, Coupon, Customer |
| Loyalty | `loyalty_accounts`, `loyalty_transactions`, `membership_tiers`, `vip_qualifications` | Customer, Order |
| Review | `product_reviews`, `review_moderations`, `review_reports` | Customer, Product, Order |
| Blog | `blog_posts`, `blog_content_blocks`, `blog_media_links`, `seo_metadata` | Media, Product, AI |
| Media | `media_assets`, `media_usages`, `media_access_policies`, `media_metadata` | Product, Brand, Blog, AI |
| Notification | `notification_requests`, `notification_templates`, `notification_recipients`, `notification_delivery_statuses` | Authentication, Order, Customer, Promotion |
| Analytics | `analytics_reports`, `metric_snapshots`, `insight_records`, `dashboard_views` | Order, Product, Inventory, Customer, Promotion, AI |
| AI | `ai_interactions`, `prompt_contexts`, `ai_output_reviews`, `ai_knowledge_sources`, `ai_safety_flags` | Product, Customer, Order, Analytics, Media, Blog, Settings |
| Settings | `store_settings`, `setting_entries`, `setting_change_requests`, `tenant_setting_profiles` | User, Notification, Payment, Shipping, AI |

## Ownership Rule / Quy tắc sở hữu

- Domain sở hữu entity thì domain đó quyết định lifecycle, validation và trạng thái dữ liệu.
- Domain khác chỉ được tham chiếu bằng FK logic hoặc bản sao snapshot khi cần giữ lịch sử nghiệp vụ.
- Order có thể giữ snapshot tên sản phẩm, giá, địa chỉ và người nhận để bảo toàn lịch sử đơn hàng.
- Analytics và AI chỉ đọc/tổng hợp, không sở hữu dữ liệu vận hành gốc.
