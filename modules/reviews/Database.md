# Review Database / Database Review

## Prompt 33 persistence audit / Audit persistence Prompt 33

**Review Persistence: READY.** Migration `1760000015000-enable-reviews-ratings-v1` tạo `product_reviews` và rollback bằng cách drop đúng table mới.

Required FKs gồm Customer, Product, Order; identity unique `(tenant_id, order_id, product_id)` vẫn tồn tại sau soft delete. Rating có DB check 1–5, trimmed content 3–2000, status `published|hidden|rejected`, audit/version/soft-delete timestamps và public/customer/order indexes.

Không tạo moderation/report/adjustment table vì Admin moderation/reporting nằm ngoài Prompt 33.2.
