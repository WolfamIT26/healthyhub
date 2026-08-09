# HealthyHub Product Detail V1

**Status:** Complete — Visual Browser Verification Blocked

## Phạm vi

Route `/products/:slug` resolve sản phẩm từ typed presentation data của Product Catalog V1. Trang không gọi Product, Cart, Wishlist, Review hay AI API; Wishlist chỉ là memory-only frontend foundation.

## Nội dung

- Gallery responsive với main media, thumbnail có active state và keyboard control. Product chỉ có một media sẽ không render thumbnail dư thừa.
- Tên, brand, category, SKU, giá, giá gốc, phần trăm giảm, rating, review count, stock status, badge và mô tả ngắn.
- Dietary tags dùng label tiếng Việt từ Product model.
- Nutrition table chỉ hiển thị field tồn tại và giữ nguyên đơn vị từ data source.
- Ingredients, allergen, storage/use note và long description chỉ render khi presentation data có giá trị.
- Review chỉ hiển thị summary; không tạo nội dung review giả.
- Related Products dùng rule presentation đơn giản: cùng category, loại sản phẩm hiện tại, tối đa 4 item.

## Commerce và AI foundation

- Quantity selector là UI state cục bộ, giới hạn 1–10 và không lưu Cart.
- Add to Cart luôn disabled; Wishlist action dùng frontend foundation và giải thích rõ chưa có server persistence. Sản phẩm hết hàng vẫn có thể được đưa vào Wishlist.
- Hỏi AI/So sánh dẫn tới route foundation kèm slug, không chạy AI runtime.

## Model

`ProductPresentationModel` được mở rộng bằng các field optional:

- `images: ProductMediaPresentation[]`
- `nutrition?: ProductNutritionPresentation`
- `ingredients`, `allergenInformation`
- `storageNote`, `usageNote`, `longDescription`

Gallery hiện dùng visual fallback có alt/label vì chưa có Product Media API. Nutrition/ingredient V1 là presentation data tập trung tại `catalog.data.ts`; ghi chú trên UI yêu cầu đối chiếu nhãn khi dữ liệu chính thức sẵn sàng.

## States và accessibility

- Loading skeleton, found, not found và error/retry.
- Một H1; Breadcrumb hợp lệ; semantic section/table/caption.
- Gallery dùng button, `aria-pressed`, alt/aria-label và focus-visible.
- Stock status luôn có text; action disabled có `aria-describedby`.
- Layout một cột trên mobile/tablet và gallery + summary hai cột từ desktop.
