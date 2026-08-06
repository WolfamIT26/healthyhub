# Logical ERD / ERD Logic

## Purpose / Mục tiêu

Tài liệu này mô tả ERD logic bằng văn bản để chuẩn bị vẽ ERD vật lý ở giai đoạn sau. Đây không phải Physical ERD và không chứa SQL.

## Identity & Access ERD / ERD định danh và quyền

```text
user_accounts 1--N user_role_assignments N--1 roles
roles 1--N role_permissions N--1 permissions
user_accounts 1--N permission_grants
user_accounts 1--N authentication_sessions
authentication_sessions 1--N login_attempts
user_accounts 1--N password_reset_requests
user_accounts 1--N account_verifications
user_accounts 1--0..1 customer_profiles
user_accounts 1--0..1 staff_profiles
```

## Catalog ERD / ERD catalog

```text
brands 1--N products
products N--N categories via product_category_links
products 1--N product_contents
products 1--N product_ingredients
products N--N media_assets via product_media_links
brands N--N media_assets via brand_media_links
blog_posts N--N media_assets via blog_media_links
blog_posts N--N products via blog_product_links future
```

## Commerce ERD / ERD thương mại

```text
products 1--N inventory_items
inventory_items 1--N stock_adjustments
inventory_items 1--N stock_alerts
inventory_items 1--N stock_reservations
customer_profiles 1--N carts
carts 1--N cart_items
cart_items N--1 products
carts 1--N applied_cart_coupons
customer_profiles 1--N wishlists
wishlists 1--N wishlist_items
wishlist_items N--1 products
customer_profiles 1--N orders
orders 1--N order_items
orders 1--N order_status_histories
orders 1--0..1 order_cancellations
orders 1--N payments
orders 1--N shipments
```

## Growth ERD / ERD tăng trưởng

```text
promotions 1--N promotion_conditions
promotions 1--N promotion_schedules
promotions 1--N promotion_targets
promotions 1--N coupon_campaign_links N--1 coupons
coupons 1--N coupon_conditions
coupons 1--N coupon_usages
customer_profiles 1--0..1 loyalty_accounts
loyalty_accounts 1--N loyalty_transactions
membership_tiers 1--N loyalty_accounts
products 1--N product_reviews
customer_profiles 1--N product_reviews
product_reviews 1--N review_moderations
product_reviews 1--N review_reports
```

## Intelligence & Operations ERD / ERD AI và vận hành

```text
notification_requests 1--N notification_recipients
notification_requests 1--N notification_delivery_statuses
notification_templates 1--N notification_requests
analytics_reports 1--N metric_snapshots
analytics_reports 1--N insight_records
dashboard_views N--1 user_accounts
ai_interactions 1--N prompt_contexts
ai_interactions 1--N ai_output_reviews
ai_interactions 1--N ai_safety_flags
ai_knowledge_sources 1--N prompt_contexts
store_settings 1--N setting_entries
store_settings 1--N setting_change_requests
tenant_setting_profiles 1--N store_settings
```

## ERD Rule / Quy tắc ERD

- Các quan hệ trên là quan hệ logical, chưa phải foreign key vật lý bắt buộc.
- Physical ERD sau này phải quyết định nullable, cascade policy, index và kiểu dữ liệu cụ thể.
- Dữ liệu cần lịch sử nghiệp vụ như order item, address, payment, shipping nên giữ snapshot thay vì phụ thuộc hoàn toàn vào entity hiện tại.
