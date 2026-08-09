# HealthyHub Wishlist V1

## Implementation mode

**Wishlist Persistence: Not implemented — awaiting approved executable backend contract.**

Repository có Wishlist domain, physical database outline, API routes và UI contract. Tuy nhiên feature specification vẫn mang trạng thái `Draft` và ghi database/API/UI ngoài phạm vi; OpenAPI hiện dùng `GenericCommandRequest` cùng generic response, chưa định nghĩa typed Wishlist item/product summary. Product và Customer persistence mà Wishlist phụ thuộc cũng chưa được triển khai. Vì vậy V1 không tự tạo table, migration, entity, endpoint hay product/customer backend.

## Frontend foundation

- Route `/wishlist` dùng existing Customer `RouteGuard`.
- Guest bấm heart không được fake-save; dialog giải thích và đưa về Login với safe return route hiện có.
- Customer đã xác minh hoặc chưa xác minh đều dùng được UI Wishlist.
- State chỉ tồn tại trong React memory, được cô lập theo actor và xóa khi logout/đổi account. Đây không phải persistence và sẽ mất khi reload.
- Không dùng `localStorage`, `sessionStorage`, cookie Wishlist hoặc fake API response.
- Catalog và Product Detail dùng chung `WishlistButton`; Wishlist page reuse `ProductCard` và giữ cả sản phẩm hết hàng.
- Set-like state ngăn duplicate product; button có label động và `aria-pressed`.

## Backend contract cần chốt trước persistence

- Typed request/response cho list/add/remove và pagination envelope.
- Mapping giữa Product presentation string ID hiện tại và Product database identifier.
- Customer profile ownership mapping từ authenticated actor.
- Product unavailable/archived response policy.
- Wishlist item status lifecycle và idempotent duplicate behavior.

Sau khi các contract này executable và Product/Customer persistence tồn tại, server phải là source of truth và frontend memory foundation phải được thay bằng API integration.

## Trạng thái

**Complete — Frontend Foundation; Server Persistence Blocked by Contract Gap; Visual Browser Verification Blocked**

Browser viewport verification không chạy vì local approval session vẫn bị revoked; không tuyên bố visual pass.
