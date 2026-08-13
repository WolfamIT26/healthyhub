# Customer Database / Cơ sở dữ liệu Customer

Migration `EnableCustomerProfileAddressV11760000008000` tạo `customer_addresses` với structured Shipping V1 fields, soft-delete/audit, FK RESTRICT đến CustomerProfile, owner/status index và hash-based create idempotency.

Generated unique `active_default_customer_id` bảo đảm tối đa một default active cho mỗi Customer. Địa chỉ đầu tiên tự thành default; xóa default promote địa chỉ active mới nhất còn lại. Raw idempotency key không persist.
