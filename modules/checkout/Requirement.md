# Checkout Executable Requirements

Trước implementation cần có:

- Customer JWT + verified email enforcement ở backend.
- Cart server revalidation ngay khi preview và confirm.
- Typed one-time address contract hoặc executable saved-address ownership.
- Authoritative Shipping method/fee/availability.
- Approved Payment method list không chứa gateway success giả.
- Transactional Order creation với idempotency và snapshot totals/address/items.
- Price/stock/shipping conflict response để frontend yêu cầu xác nhận lại.
