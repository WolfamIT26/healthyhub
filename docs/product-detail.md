# HealthyHub Product Detail V1

## Phạm vi

Route `/products/:slug` giữ UX Prompt 22 và resolve trực tiếp bằng `GET /api/v1/public/products/{productId}`; `{productId}` nhận numeric ID hoặc canonical slug. Direct URL/reload không phụ thuộc React memory.

## Dữ liệu authoritative

API trả Product/Category/Brand identity, persisted price/content, dietary tags, ingredient/allergen, nutrition, public media và Inventory availability. Media bị ẩn/inactive không được join. Khi chưa có public media, UI dùng visual fallback rõ ràng thay vì tạo URL giả.

Related Products do backend chọn cùng primary Category, loại Product hiện tại và tối đa 4 item. Invalid/hidden/private/inactive Product trả not-found; lỗi transport khác có ErrorState + Retry.

## Commerce và boundary

Add to Cart tiếp tục gửi Product ID thật; Cart server tái kiểm tra Product/Inventory. Wishlist dùng Product authority hiện hữu. Frontend không suy luận giá, sellable hoặc availability. Review và AI runtime chưa executable nên không có rating/review/recommendation giả.

## Accessibility

Trang giữ Breadcrumb, một H1, gallery keyboard/`aria-pressed`, nutrition table, status text và disabled action semantics. Layout responsive một cột trên mobile/tablet và hai cột từ desktop.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
