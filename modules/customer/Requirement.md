# Customer Requirements / Yêu cầu Customer

- Customer xem/cập nhật `fullName`, `phone`; email Authentication chỉ đọc.
- Customer quản lý địa chỉ Việt Nam có một default active.
- Guest/Internal bị chặn; Customer không gửi `customerId` làm authority.
- Address Book chỉ prefill Checkout; Order/Shipment lưu snapshot bất biến.
- Server whitelist field, validate phone/address và không expose metadata nội bộ.
