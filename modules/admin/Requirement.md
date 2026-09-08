# Admin Requirement / Yêu cầu Admin

## Access / Truy cập

- Guest bị chuyển tới Login; Customer nhận Forbidden; `STAFF`, `MANAGER`, `ADMINISTRATOR` có thể vào shell.
- Backend bắt buộc Bearer session active, account active, current Internal role và `analytics:read` cho Dashboard.
- Role, tenant và permission không nhận từ body/query/header tùy ý.
- Refresh/reload khôi phục actor qua Auth session; logout/account switch xóa state in-memory.

## Dashboard / Dashboard

- Chỉ hiển thị Product total/active-public/unavailable, Order total/status counts và Review total/status counts.
- Không hiển thị revenue, profit, conversion, growth, best-selling hoặc pending moderation khi chưa có authority.
- Không trả Customer PII, provider payload, secret hoặc internal audit fields.

## Products / Sản phẩm

- Staff/Manager/Administrator có `products:read` xem danh sách, detail và options.
- Manager/Administrator có `products:manage` tạo, sửa, đổi lifecycle và soft-delete Product.
- Frontend phải dùng API thật, không hard-code Product state hoặc cho role manipulation vượt backend.
- Inventory, Order, Review, User/Role và upload/import/export không nằm trong Admin Product V1.
