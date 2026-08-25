# Admin Frontend / Frontend Admin

Route `/admin` dùng parent `RouteGuard` trước khi render `AdminLayout`. Shell gồm responsive sidebar/drawer, header actor/role, content area, Storefront link và canonical logout.

Dashboard có skeleton, error/retry, forbidden và empty state; data đến từ typed `adminApi`, không fixture/localStorage/client aggregate.

Dashboard là navigation executable duy nhất. Products, Inventory, Orders và Reviews giữ disabled kèm lý do rõ, không dẫn tới màn hình giả.
