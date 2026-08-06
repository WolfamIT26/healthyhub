# Design System Index / Mục lục hệ thống thiết kế

## Purpose / Mục tiêu

`docs/design-system` là nguồn tài liệu chính cho Design System của HealthyHub. Bộ tài liệu này chuẩn hóa nguyên tắc, token, component và trạng thái giao diện để Web và Mobile App sau này dùng cùng một chuẩn.

Prompt 12 chỉ tạo tài liệu. Không viết React, không viết CSS, không tạo Figma, không tạo UI hoàn chỉnh và không sinh code.

## Input References / Tài liệu đầu vào

- [UI Contract Specification](../../.spec/ui-contract/README.md).
- [Business Blueprint](../business-blueprint/README.md).
- [Feature Specifications](../../.spec/features/README.md).
- [UI/UX Guideline](../06-ui-ux.md).

## Reading Order / Thứ tự đọc

1. [Design Principles / Nguyên tắc thiết kế](design-principles.md).
2. [Design Tokens / Token thiết kế](design-tokens.md).
3. [Color Palette / Bảng màu](colors.md).
4. [Typography / Chữ](typography.md).
5. [Spacing / Khoảng cách](spacing.md).
6. [Border Radius / Bo góc](border-radius.md).
7. [Elevation / Cấp nổi](elevation.md).
8. [Shadow / Đổ bóng](shadow.md).
9. [Grid / Lưới layout](grid.md).
10. [Breakpoints / Điểm responsive](breakpoints.md).
11. [Icon Guideline / Quy tắc icon](icon-guideline.md).
12. [Illustration Guideline / Quy tắc minh họa](illustration-guideline.md).
13. [Motion Guideline / Quy tắc chuyển động](motion-guideline.md).
14. [Dark Mode / Chế độ tối](dark-mode.md).
15. [Component Library / Thư viện component](component-library.md).
16. [Component Usage Map / Mapping component](component-usage-map.md).
17. [Accessibility Guideline / Khả năng tiếp cận](accessibility-guideline.md).
18. [Components / Chi tiết component](components/README.md).

## Design Scope / Phạm vi thiết kế

| Area / Khu vực | Coverage / Bao phủ |
| --- | --- |
| Storefront | Trang chủ, danh sách sản phẩm, chi tiết sản phẩm, blog, AI hỗ trợ public-safe. |
| Commerce | Giỏ hàng, checkout, coupon, order status, wishlist, loyalty. |
| Customer Account | Hồ sơ, địa chỉ, đơn hàng, thông báo, đánh giá. |
| Admin/Staff | Dashboard, bảng dữ liệu, form quản trị, modal xác nhận, drawer chi tiết, analytics. |
| AI | Chat box, AI output, source list, confidence, safety notice, human review. |
| Mobile Future | Quy tắc responsive và token dùng được cho Mobile App sau này. |

## Output Rule / Quy tắc đầu ra

- Nội dung dùng tiếng Việt.
- Heading dùng song ngữ English + Vietnamese.
- Component name dùng tiếng Anh.
- UI label khi triển khai sau này dùng tiếng Việt.
- Không tạo code implementation trong Design System.
- Mọi component phải có Purpose, Variant, Size, State, Accessibility, Responsive Rule, Usage, Do và Don't.

## Status Files / File trạng thái

- [Status](Status.md).
- [Report](Report.md).
- [Checklist](Checklist.md).
- [ChangeLog](ChangeLog.md).

