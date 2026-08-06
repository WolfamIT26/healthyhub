# Index Catalog / Danh mục Index vật lý

## Purpose / Mục tiêu

Tài liệu này gom các index vật lý quan trọng để prompt sinh migration sau này có thể xác định tên index, loại index, thứ tự cột và mục đích. Đây vẫn là tài liệu thiết kế, không phải SQL.

## Identity & Access Index / Index định danh và quyền

| Table | Index Type | Index Name | Columns / Cột | Purpose / Mục đích |
| --- | --- | --- | --- | --- |
| `user_accounts` | Unique | `uq_user_accounts_tenant_email` | `tenant_id`, `email` | Login và chống trùng email. |
| `user_accounts` | Unique | `uq_user_accounts_tenant_phone` | `tenant_id`, `phone` | Login và chống trùng phone. |
| `user_accounts` | Composite | `idx_user_accounts_tenant_status` | `tenant_id`, `user_status`, `created_at` | Danh sách user admin. |
| `roles` | Unique | `uq_roles_tenant_code` | `tenant_id`, `role_code` | Chống trùng role. |
| `permissions` | Unique | `uq_permissions_code` | `permission_code` | Chống trùng permission global. |
| `role_permissions` | Unique | `uq_role_permissions_role_permission` | `tenant_id`, `role_id`, `permission_id` | Chống gán trùng. |
| `user_role_assignments` | Composite | `idx_user_roles_user_status` | `tenant_id`, `user_account_id`, `assignment_status` | Kiểm quyền user. |
| `authentication_sessions` | Composite | `idx_auth_sessions_user_status` | `tenant_id`, `user_account_id`, `session_status` | Lấy session active. |
| `login_attempts` | Composite | `idx_login_attempts_identifier_time` | `tenant_id`, `identifier`, `attempted_at` | Rate limit theo identifier. |
| `login_attempts` | Composite | `idx_login_attempts_ip_time` | `tenant_id`, `ip_address`, `attempted_at` | Rate limit theo IP. |

## Catalog Index / Index catalog

| Table | Index Type | Index Name | Columns / Cột | Purpose / Mục đích |
| --- | --- | --- | --- | --- |
| `products` | Unique | `uq_products_tenant_code` | `tenant_id`, `product_code` | Chống trùng mã sản phẩm. |
| `products` | Unique | `uq_products_tenant_slug` | `tenant_id`, `slug` | Product SEO route. |
| `products` | Composite | `idx_products_public_listing` | `tenant_id`, `product_visibility`, `sellable_status`, `product_status`, `created_at` | Listing public. |
| `products` | Full Text | `ft_products_name` | `product_name` | Search sản phẩm. |
| `product_contents` | Full Text | `ft_product_contents_text` | `description`, `summary` | Search nội dung sản phẩm. |
| `product_ingredients` | Composite | `idx_product_ingredients_product_order` | `tenant_id`, `product_id`, `display_order` | Hiển thị thành phần. |
| `categories` | Unique | `uq_categories_tenant_slug` | `tenant_id`, `slug` | Category SEO route. |
| `categories` | Composite | `idx_categories_visibility_status` | `tenant_id`, `category_visibility`, `category_status` | Navigation public. |
| `product_category_links` | Unique | `uq_product_category_links_product_category` | `tenant_id`, `product_id`, `category_id` | Chống gắn trùng. |
| `brands` | Unique | `uq_brands_tenant_slug` | `tenant_id`, `brand_slug` | Brand SEO route. |
| `media_assets` | Composite | `idx_media_assets_purpose_visibility` | `tenant_id`, `media_purpose`, `media_visibility`, `media_status` | Media listing. |
| `blog_posts` | Unique | `uq_blog_posts_tenant_slug` | `tenant_id`, `post_slug` | Blog SEO route. |
| `blog_posts` | Full Text | `ft_blog_posts_title_summary` | `post_title`, `post_summary` | Blog search. |
| `blog_content_blocks` | Full Text | `ft_blog_blocks_content` | `block_content` | Search nội dung blog. |

## Commerce Index / Index thương mại

| Table | Index Type | Index Name | Columns / Cột | Purpose / Mục đích |
| --- | --- | --- | --- | --- |
| `inventory_items` | Unique | `uq_inventory_items_tenant_product` | `tenant_id`, `product_id` | Một tồn kho chính mỗi product ở MVP. |
| `inventory_items` | Composite | `idx_inventory_product_status` | `tenant_id`, `product_id`, `stock_status` | Kiểm tra khả năng bán. |
| `stock_adjustments` | Composite | `idx_stock_adjustments_item_time` | `tenant_id`, `inventory_item_id`, `adjusted_at` | Lịch sử tồn kho. |
| `stock_reservations` | Composite | `idx_stock_reservations_item_status` | `tenant_id`, `inventory_item_id`, `reservation_status`, `expires_at` | Reservation checkout. |
| `carts` | Composite | `idx_carts_customer_status` | `tenant_id`, `customer_profile_id`, `cart_status` | Lấy active cart. |
| `carts` | Composite | `idx_carts_guest_status` | `tenant_id`, `guest_session_reference`, `cart_status` | Lấy guest cart. |
| `cart_items` | Composite | `idx_cart_items_cart` | `tenant_id`, `cart_id`, `item_status` | Hiển thị giỏ. |
| `wishlists` | Composite | `idx_wishlists_customer_status` | `tenant_id`, `customer_profile_id`, `wishlist_status` | Wishlist khách. |
| `orders` | Unique | `uq_orders_tenant_code` | `tenant_id`, `order_code` | Tra cứu đơn. |
| `orders` | Composite | `idx_orders_customer_time` | `tenant_id`, `customer_profile_id`, `placed_at` | Lịch sử đơn khách. |
| `orders` | Composite | `idx_orders_status_time` | `tenant_id`, `order_status`, `placed_at` | Admin xử lý đơn. |
| `order_items` | Composite | `idx_order_items_product` | `tenant_id`, `product_id`, `created_at` | Analytics theo product. |
| `payments` | Composite | `idx_payments_order_status` | `tenant_id`, `order_id`, `payment_status` | Trạng thái payment theo order. |
| `payments` | Composite | `idx_payments_provider_ref` | `tenant_id`, `provider_reference` | Reconcile provider future. |
| `shipments` | Composite | `idx_shipments_order_status` | `tenant_id`, `order_id`, `shipping_status` | Trạng thái shipping theo order. |
| `shipments` | Composite | `idx_shipments_tracking` | `tenant_id`, `tracking_reference` | Tracking provider future. |

## Growth Index / Index tăng trưởng

| Table | Index Type | Index Name | Columns / Cột | Purpose / Mục đích |
| --- | --- | --- | --- | --- |
| `coupons` | Unique | `uq_coupons_tenant_code` | `tenant_id`, `coupon_code` | Validate coupon. |
| `coupons` | Composite | `idx_coupons_status_validity` | `tenant_id`, `coupon_status`, `valid_from`, `valid_to` | Kiểm hiệu lực. |
| `coupon_usages` | Composite | `idx_coupon_usages_customer_time` | `tenant_id`, `customer_profile_id`, `used_at` | Limit theo khách. |
| `promotions` | Composite | `idx_promotions_status_type` | `tenant_id`, `promotion_status`, `promotion_type` | Tìm promotion active. |
| `promotion_schedules` | Composite | `idx_promotion_schedules_time_status` | `tenant_id`, `schedule_status`, `start_at`, `end_at` | Matching promotion. |
| `promotion_targets` | Composite | `idx_promotion_targets_type_reference` | `tenant_id`, `target_type`, `target_reference_id`, `target_status` | Matching target. |
| `loyalty_accounts` | Unique | `uq_loyalty_accounts_customer` | `tenant_id`, `customer_profile_id` | Một loyalty account active. |
| `loyalty_transactions` | Composite | `idx_loyalty_transactions_account_time` | `tenant_id`, `loyalty_account_id`, `occurred_at` | Lịch sử điểm. |
| `product_reviews` | Composite | `idx_reviews_product_status` | `tenant_id`, `product_id`, `review_status`, `published_at` | Review public theo product. |
| `product_reviews` | Full Text | `ft_reviews_content` | `review_content` | Search/moderation review. |

## Intelligence & Operations Index / Index AI và vận hành

| Table | Index Type | Index Name | Columns / Cột | Purpose / Mục đích |
| --- | --- | --- | --- | --- |
| `notification_templates` | Unique | `uq_notification_templates_code_channel_version` | `tenant_id`, `template_code`, `notification_channel`, `version` | Template versioning. |
| `notification_requests` | Composite | `idx_notification_requests_type_status_time` | `tenant_id`, `notification_type`, `request_status`, `requested_at` | Queue/admin listing. |
| `notification_delivery_statuses` | Composite | `idx_notification_delivery_status_time` | `tenant_id`, `delivery_status`, `attempted_at` | Retry/report. |
| `analytics_reports` | Unique | `uq_analytics_reports_scope_period` | `tenant_id`, `report_scope`, `reporting_period` | Một report mỗi kỳ/scope. |
| `metric_snapshots` | Composite | `idx_metric_snapshots_source_period` | `tenant_id`, `source_domain`, `period_start`, `period_end` | Dashboard/analytics. |
| `insight_records` | Composite | `idx_insight_records_type_confidence` | `tenant_id`, `insight_type`, `insight_confidence`, `insight_status` | Ưu tiên insight. |
| `ai_interactions` | Composite | `idx_ai_interactions_capability_status_time` | `tenant_id`, `ai_capability_type`, `interaction_status`, `requested_at` | Review/log AI. |
| `prompt_contexts` | Composite | `idx_prompt_contexts_source_domain` | `tenant_id`, `source_domain`, `source_reference_id` | Audit context source. |
| `ai_safety_flags` | Composite | `idx_ai_safety_flags_status_time` | `tenant_id`, `flag_status`, `safety_level`, `flagged_at` | Review risk. |
| `setting_entries` | Unique | `uq_setting_entries_scope_key` | `tenant_id`, `configuration_scope`, `setting_key`, `deleted_at` | Lấy setting theo key. |
| `setting_change_requests` | Composite | `idx_setting_change_requests_status_time` | `tenant_id`, `change_status`, `requested_at` | Approval queue. |

## Review Rule / Quy tắc review index

- Index catalog này phải được kiểm tra lại khi API Specification xác định query thật.
- Index ít dùng sẽ bị loại ở migration review để tránh làm chậm ghi dữ liệu.
- Full text index chỉ dùng khi MySQL search đủ cho MVP; nếu dùng search engine riêng sau này, tạo ADR trước.
