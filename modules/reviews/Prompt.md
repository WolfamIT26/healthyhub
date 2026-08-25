# Prompt 33 / Reviews & Ratings V1

Prompt yêu cầu Review persistence/API/aggregate/Product Detail thật, nhưng đồng thời yêu cầu dừng nếu lifecycle chưa đủ xác định “đã mua/đã hoàn tất”. Audit ngày 2026-08-21 xác nhận condition này xảy ra; implementation dừng tại documentation/spec/OpenAPI boundary.

Không commit, push, merge hoặc bắt đầu Prompt 34.

Prompt 33.1 chỉ mở fulfillment và eligibility contract. Prompt tiếp theo phải reuse `ReviewEligibilityService`, recheck eligibility transactionally và dùng unique `(tenant_id, order_id, product_id)`; không thay đổi Payment/Fulfillment authority.

## Prompt 33.2

Đã triển khai Review persistence/API/aggregate/Product Detail dựa trên contract 33.1. Không triển khai Admin moderation UI/API, media, voting, comments, seller replies, rewards, recommendation engine hoặc Prompt 34.
