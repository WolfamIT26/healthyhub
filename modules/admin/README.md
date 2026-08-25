# Admin Foundation V1 / Nền tảng quản trị V1

## Status / Trạng thái

**READY** cho access control, `/admin` shell và Dashboard read-only. Backend dùng account/session/role/permission authority của Authentication/User; không tạo authority song song.

Dashboard đọc aggregate tenant đơn canonical từ Product, Inventory, Order và Review. Products, Inventory, Orders và Reviews navigation chưa executable được hiển thị disabled; không có CRUD giả.

Hai Admin Review moderation operations tiếp tục blocked bằng `ADMIN_REVIEW_MODERATION_NOT_IMPLEMENTED` vì chưa có policy reason, re-publish và audit đầy đủ.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
