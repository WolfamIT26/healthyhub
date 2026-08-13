# Customer Decisions / Quyết định Customer

- Editable Profile V1 chỉ gồm `fullName`, `phone`; email thuộc Authentication và read-only.
- Address V1 reuse Shipping contract, `countryCode=VN`; khu vực dùng validated free-text đến khi có geography authority.
- Một active default mỗi Customer; first address/default promotion được transaction và DB constraint bảo vệ.
- Saved Address là prefill convenience, không là Order authority; immutable Order snapshot là nguồn lịch sử.
- Không expose customerProfileId/audit/idempotency metadata; không cho unsetting default trực tiếp nếu chưa chọn default khác.
