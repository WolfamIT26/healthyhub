# Reviews & Ratings V1 / Đánh giá sản phẩm V1

## Status / Trạng thái

**Reviews & Ratings V1 READY — persistence, eligibility, API, aggregate and Product Detail are executable.**

Prompt 33.1 đã thêm authoritative Order `completed` + Shipment `delivered` transition, persisted timestamps và owner-scoped `ReviewEligibilityService`. Eligibility yêu cầu Product thuộc active Order Item của đúng Customer; cancelled/returned fulfillment bị revoke.

Prompt 33.2 thêm `product_reviews`, typed public/customer API và Product Detail Review section. Canonical identity là `Order + Product`; publication mặc định `published`, owner edit in-place, owner delete soft-delete. Create recheck fulfillment dưới Order/Shipment locks trong transaction. Rating summary chỉ tính Review active/published; return giữ content nhưng verified badge được suy ra lại thành false.

Admin moderation API/UI, media, voting, comments, seller reply, rewards và AI moderation không thuộc V1 này.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
