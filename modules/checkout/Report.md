# Checkout V1 Report — Prompt 26.2

## Status

**COMPLETE — Visual Browser Verification Blocked.**

Checkout is no longer ComingSoon. Verified Customers can load their authoritative Cart, enter a VN delivery address, obtain the server Shipping quote, review COD and confirm through the real idempotent Order API. Invalid Cart/address/stock conflicts never display success.

## Boundaries

- Prompt 26.2 was COD-only at the time; Prompt 27.2 adds backend-driven payment method discovery with COD + VNPAY.
- Shipping `manual` method/name/fee/reference comes from the server quote. Fee is never assigned by frontend.
- Cart remains active and header count is not reset after Order success.
- No payment capture, fulfillment or Inventory mutation.
- Prompt 27.1 chuẩn hóa frontend future states/return-query rule; Prompt 27.2 mới mở khóa VNPAY selection, redirect và result query.

## Verification limitation

Automated frontend/backend/MySQL verification passed. Browser visual verification could not start because the in-app browser execution connection is unavailable, so responsive visual status is recorded separately as BLOCKED.

## Prompt 27.2 — Checkout payment expansion

Checkout đã bỏ trạng thái COD-only ở lớp UI contract. Hệ thống giờ:

- đọc payment method từ backend
- hiển thị COD và VNPAY theo capability server
- tạo Order trước khi redirect VNPAY
- giữ browser return/result là non-authoritative
- giữ COD flow nguyên trạng, không gọi provider

Tách rời như vậy giúp Checkout không cần biết cách ký request hay build query VNPAY.

## Prompt 27.3 Verification / Kiểm tra Prompt 27.3

Frontend regression chứng minh Return chỉ điều hướng và Result tải lại backend state. MySQL integration chứng minh Order được tạo trước Payment attempt, snapshot OrderItem/Shipment/address giữ nguyên, valid IPN mới xác nhận Order và duplicate không double effect. COD vẫn pending/new, không gọi provider. Sandbox browser flow chưa chạy vì runtime không có VNPAY credentials và public HTTPS IPN callback.
