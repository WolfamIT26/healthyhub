# Order Prompt / Prompt module đơn hàng

AI Agent phải đọc rules, Order specification và các boundary Authentication, Customer, Payment, Shipping, Checkout trước khi sửa module.

Mọi Customer read API phải derive owner từ authenticated context và dùng persisted snapshot. Fulfillment mutation chỉ đi qua internal `OrderFulfillmentService`, không nhận status trực tiếp từ frontend. Giữ Payment/VNPAY authority riêng, browser return read-only, và không mở public/admin endpoint nếu actor/permission contract chưa executable.
