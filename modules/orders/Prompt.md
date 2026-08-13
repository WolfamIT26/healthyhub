# Order Prompt / Prompt module đơn hàng

AI Agent phải đọc rules, Order specification và các boundary Authentication, Customer, Payment, Shipping, Checkout trước khi sửa module.

Mọi Customer read API phải derive owner từ authenticated context, dùng persisted snapshot, không expose provider secret và không mở action cancellation/refund/fulfillment nếu prompt hiện tại không cho phép.
