# Review API / API Review

## Runtime boundary / Ranh giới runtime

**Review public/customer API: READY.**

- `GET /public/products/:productId/reviews`: published active list, pagination, safe author label, dynamic verified badge.
- `GET /public/products/:productId/reviews/summary`: average, total và distribution 1–5.
- `GET /me/reviews`: owner list; optional `productId` trả safe eligibility/opportunity.
- `POST /me/reviews`: create bằng `{orderId, productId, rating, content}`.
- `PATCH|DELETE /me/reviews/:reviewId`: owner-only update và soft delete.

Owner derive từ JWT → CustomerProfile; DTO không nhận `customerId` hoặc `verifiedPurchase`. Hai Admin moderation operations vẫn design-only với blocker `ADMIN_REVIEW_MODERATION_NOT_IMPLEMENTED`.
