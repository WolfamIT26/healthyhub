# Wishlist Requirements / Yêu cầu Wishlist

- Customer chỉ đọc/sửa Wishlist của chính mình; authority không đến từ client `customerId`.
- Add/remove phải persist qua reload, chống duplicate và giữ Product hết hàng với presentation phù hợp.
- Guest được nhắc đăng nhập; unverified Customer vẫn dùng được; Internal bị từ chối.
- Logout clear client state nhưng không xóa server data; account switch không leak state.
- Không dùng browser storage, không expose internal/audit metadata và không mở feature ngoài Prompt 30.
