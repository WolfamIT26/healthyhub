# Order Checklist / Checklist module đơn hàng

## Prompt 28 / Customer Orders V1

- [x] Đọc rules/spec và Auth/Customer/Order/Payment/Shipping/Checkout hiện tại.
- [x] Audit Order API và chỉ bổ sung hai Customer read endpoint còn thiếu.
- [x] Owner derive server-side; không nhận `customerId`.
- [x] Pagination/filter whitelist/stable sort.
- [x] Persisted item/price/address/Payment/Shipping snapshots.
- [x] Guest/Internal/invalid/not-owned isolation.
- [x] List/detail responsive với loading/empty/error và direct reload.
- [x] Customer navigation và Checkout/Payment Result links.
- [x] COD/VNPAY canonical Payment status; browser return không có authority.
- [x] Unit, frontend và MySQL integration coverage riêng.
- [x] OpenAPI typed list/detail responses.
- [x] Full workspace test/lint/typecheck/build/OpenAPI/secrets/docs/diff verification.
- [x] MySQL regression cho Auth/Cart/Order/Payment/VNPAY.
- [x] Production preview `/orders` và `/orders/:orderId` direct URL trả SPA HTML 200.
- [ ] Browser visual verification — runtime hiện không expose in-app Browser control; responsive/direct-route đã cover bằng frontend tests và production build.
