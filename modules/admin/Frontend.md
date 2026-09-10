# Admin Frontend / Frontend Admin

Route `/admin` dùng parent `RouteGuard` trước khi render `AdminLayout`. Shell gồm responsive sidebar/drawer, header actor/role, content area, Storefront link và canonical logout.

Dashboard có skeleton, error/retry, forbidden và empty state; data đến từ typed `adminApi`, không fixture/localStorage/client aggregate.

Dashboard và Products là navigation executable. Products route dùng server list/detail/options, create/edit form, lifecycle controls và soft-delete confirmation. Inventory, Orders và Reviews giữ disabled kèm lý do rõ, không dẫn tới màn hình giả.
