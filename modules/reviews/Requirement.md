# Review Requirement / Yêu cầu Review

## Canonical contract / Contract chuẩn

- Customer authenticated và owner được derive từ JWT → CustomerProfile.
- Order phải thuộc Customer và có Order Item trỏ tới Product được review.
- Order phải `completed`, Shipment phải `delivered`, `completedAt` và `deliveredAt` phải persisted bởi approved transition.
- Cancelled/returned Order hoặc Shipment không còn đủ eligibility. Payment refund riêng không tự quyết định fulfillment.
- Duplicate identity là `Order + Product`: một review cho mỗi Product trong mỗi fulfilled purchase occasion.
- Publication mặc định là `published`; owner edit cập nhật published content tại chỗ; owner delete là soft delete.
- Return sau khi review tồn tại revoke verified-purchase evidence/badge nhưng giữ content public.

`new`, `confirmed`, `paid` hoặc stock `consumed` không tự động thỏa yêu cầu trải nghiệm mua hàng.

## Executable API/data rules / Rule API/data đã chạy

- Rating integer 1–5; trimmed content 3–2000 characters.
- Public list/aggregate chỉ tính Review `published` và chưa soft-delete.
- Không expose Customer email/phone/ID hoặc Order ID trong public item.
- Exact create retry cùng nội dung là idempotent; conflicting duplicate là 409.
- DB unique và pessimistic locks bảo vệ concurrent create/update/delete.
