# Accessibility Standard / Chuẩn khả năng tiếp cận

## Purpose / Mục tiêu

Accessibility giúp người dùng mua hàng, đọc thông tin sản phẩm và vận hành admin dễ dàng hơn. Chuẩn này bám UI Contract và Design System.

## General Rules / Quy tắc chung

- UI text dùng tiếng Việt rõ.
- Form field phải có label.
- Error message hiển thị gần nơi xảy ra lỗi.
- Không chỉ dùng màu để thể hiện trạng thái.
- Button icon-only phải có accessible label.
- Focus state phải rõ cho keyboard navigation.

## Storefront Commerce / Storefront và mua hàng

- Giá, trạng thái tồn kho, cảnh báo dị ứng và khuyến mãi phải có text.
- CTA chính không bị che trên mobile.
- Product image cần alt text.
- Checkout phải đọc được từng bước và lỗi từng field.

## Admin / Quản trị

- Table header rõ, status badge có text.
- Modal/drawer cần title và action rõ.
- Action nguy hiểm cần confirmation.
- Keyboard flow cần được review ở phase frontend.

## AI Accessibility / Accessibility cho AI

- AI answer phân biệt rõ với user message bằng label.
- Disclaimer và safety notice phải đọc được.
- Source/confidence không chỉ dùng màu.
- Có fallback hoặc hướng chuyển người thật khi AI không đủ thông tin.

