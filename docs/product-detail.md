# HealthyHub Product Detail V1

## Phạm vi

Route `/products/:slug` giữ UX Prompt 22 và resolve trực tiếp bằng `GET /api/v1/public/products/{productId}`; `{productId}` nhận numeric ID hoặc canonical slug. Direct URL/reload không phụ thuộc React memory.

## Dữ liệu authoritative

API trả Product/Category/Brand identity, persisted price/content, dietary tags, ingredient/allergen, nutrition, public media và Inventory availability. Media bị ẩn/inactive không được join. Khi chưa có public media, UI dùng visual fallback rõ ràng thay vì tạo URL giả.

Related Products do backend chọn cùng primary Category, loại Product hiện tại và tối đa 4 item. Invalid/hidden/private/inactive Product trả not-found; lỗi transport khác có ErrorState + Retry.

## Commerce và boundary

Add to Cart tiếp tục gửi Product ID thật; Cart server tái kiểm tra Product/Inventory. Wishlist dùng Product authority hiện hữu. Frontend không suy luận giá, sellable hoặc availability. AI runtime chưa executable nên không có recommendation giả.

## Prompt 33 Review audit / Audit Review Prompt 33

## Prompt 33.2 Reviews & Ratings V1

Product Detail Review integration **READY**. Trang gọi `GET /public/products/:productId/reviews` và `/summary` để hiển thị average, total, distribution, public list, verified badge và pagination. Guest có login CTA; Customer chỉ thấy form khi `/me/reviews?productId=...` trả authoritative eligible Order.

Create/edit/delete dùng owner API và inline feedback. Returned Order giữ content nhưng badge được backend resolve thành false. Product API không thêm rating/count fixture; frontend không tự aggregate từ page đang tải.

## Accessibility

Trang giữ Breadcrumb, một H1, gallery keyboard/`aria-pressed`, nutrition table, status text và disabled action semantics. Layout responsive một cột trên mobile/tablet và hai cột từ desktop.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
