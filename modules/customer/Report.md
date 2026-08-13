# Customer Profile & Address Report / Báo cáo Customer Profile & Address

Prompt 29 đưa Customer account area lên persistence thật. Profile response ghép CustomerProfile với read-only email từ Authentication; mutation chỉ cho fullName/phone. Address Book dùng structured VN fields của Shipping V1, default uniqueness, create dedupe và soft delete.

Owner derive từ JWT → active CustomerProfile; Internal bị deny, ID của owner khác trả 404. DTO/server validation từ chối customerId/email/role/audit metadata. Response không expose internal IDs/hashes.

Checkout load Address Book để prefill form nhưng vẫn hỗ trợ nhập tay. Order create nhận address values hiện hữu và lưu ShippingAddress snapshot riêng; sửa/xóa saved Address không hồi tố Order cũ. Shipping fee authority và Payment/VNPAY không thay đổi.
