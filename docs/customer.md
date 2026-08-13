# HealthyHub Customer Account / Tài khoản Customer

## Status / Trạng thái

Customer Profile, Address persistence/CRUD và Checkout saved-address integration đều **READY**.

`/account/profile` đọc/sửa full name và phone từ database; Authentication email chỉ đọc. `/account/addresses` quản lý structured Vietnam addresses, một default active, loading/empty/error/success và responsive UI.

Mọi backend query resolve owner từ Customer JWT; frontend không gửi `customerId`. Global validation từ chối field ngoài whitelist. Address ID không được dùng làm Order authority: Checkout chỉ prefill form và Order/Shipment persist immutable snapshot, nên sửa/xóa saved Address không đổi lịch sử.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
