# Admin Checklist / Checklist Admin

- [x] Audit Authentication/User/Customer/Product/Inventory/Order/Payment/Review.
- [x] Reuse roles, permissions, JWT/session guards và tenant đơn V1.
- [x] Recheck account/session/current roles server-side.
- [x] Thêm typed Admin Dashboard read API từ persistence thật.
- [x] Bảo vệ Guest, Customer, disabled/locked actor và permission thiếu.
- [x] Không expose PII/secret/provider/audit data.
- [x] Tạo responsive Admin shell và parent route boundary.
- [x] Thêm loading/error/retry/forbidden/empty state.
- [x] Disable module chưa executable; không tạo CRUD giả.
- [x] Giữ Review moderation blocked.
- [x] Không tạo migration hoặc Admin credential.
- [x] Cập nhật OpenAPI/spec/security/docs.
- [x] Ghi kết quả full verification cuối.
- [x] Prompt 35: open Products navigation only when Product management runtime exists.
- [x] Prompt 35: require `products:read` and `products:manage` permissions through current permission guards.
- [x] Prompt 35: keep Inventory, Orders, Reviews moderation and User/Role management disabled/out of scope.
- [x] Prompt 35: add frontend loading/error/retry/empty/forbidden and mutation states.
