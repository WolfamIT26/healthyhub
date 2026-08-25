# Admin Database / Database Admin

Prompt 34 không tạo schema hoặc migration. Authorization reuse `user_accounts`, `authentication_sessions`, `roles`, `permissions`, `role_permissions` và `user_role_assignments`.

Seed canonical bổ sung permission `analytics:read` cho `STAFF`, `MANAGER`, `ADMINISTRATOR`; không tạo hoặc hard-code Admin account/credential.

Dashboard query read-only và tenant-scoped trên `products`, `inventory_items`, `orders`, `product_reviews`; chỉ đếm row chưa soft-delete. Không tạo aggregate cache, analytics table hoặc audit system mới.
