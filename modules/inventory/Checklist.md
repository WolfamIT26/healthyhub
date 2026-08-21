# Inventory Checklist / Checklist Inventory

- [x] Audit `.ai/rules`, `.ai/context`, `.spec` và implementation liên quan.
- [x] Reuse `inventory_items` và `InventoryAvailabilityReader`.
- [x] Kiểm tra FK, unique và non-negative constraints; không thêm migration thừa.
- [x] Đồng nhất zero-stock giữa Inventory reader và Product public read model.
- [x] Giữ public Product response không có Inventory quantity.
- [x] Kiểm tra Cart add/update/read server authority.
- [x] Audit Order, Checkout, COD, VNPAY return/IPN và event dedupe.
- [x] Không thêm Admin Inventory UI hoặc API chưa executable.
- [x] Ghi Order Stock Integration là BLOCKED, không fake PASS.
- [x] Chạy toàn bộ verification và ghi kết quả cuối trong Report/Work Summary.
- [x] Chốt COD/VNPAY reserve, consume, release, late-paid reacquire và restock contract.
- [x] Thêm durable reservation/idempotency persistence, không tạo adjustment authority song song.
- [x] Tích hợp stock effect vào transaction owner của Order và verified VNPAY IPN.
- [x] Kiểm tra no-negative, concurrent purchase, duplicate mutation/IPN và rollback.
- [x] Giữ Admin Inventory UI/API ngoài scope.
