# Prompt 11 - UI Contract Specification / Tổng hợp đặc tả hợp đồng UI

## Task / Nhiệm vụ

Tạo UI Contract Specification cho HealthyHub dựa trên API Specification, Data Contract, Domain Model, Feature Specifications và Business Blueprint.

## Summary / Tóm tắt

Đã tạo bộ tài liệu `.spec/ui-contract` để chuẩn hóa màn hình trước khi thiết kế Design System hoặc Frontend Development. Bộ tài liệu mô tả navigation, screen flow, component mapping, state contract và 32 màn hình chính.

## Added / Đã thêm

- `.spec/ui-contract/README.md`
- `.spec/ui-contract/ui-contract-standards.md`
- `.spec/ui-contract/navigation.md`
- `.spec/ui-contract/screen-flow.md`
- `.spec/ui-contract/component-mapping.md`
- `.spec/ui-contract/state-contract.md`
- `.spec/ui-contract/Status.md`
- `.spec/ui-contract/Report.md`
- `.spec/ui-contract/Checklist.md`
- `.spec/ui-contract/ChangeLog.md`
- `.spec/ui-contract/screens/README.md`
- `.spec/ui-contract/screens/home.md`
- `.spec/ui-contract/screens/product-list.md`
- `.spec/ui-contract/screens/product-detail.md`
- `.spec/ui-contract/screens/blog-list.md`
- `.spec/ui-contract/screens/blog-detail.md`
- `.spec/ui-contract/screens/ai-assistant.md`
- `.spec/ui-contract/screens/login.md`
- `.spec/ui-contract/screens/register.md`
- `.spec/ui-contract/screens/forgot-password.md`
- `.spec/ui-contract/screens/cart.md`
- `.spec/ui-contract/screens/checkout.md`
- `.spec/ui-contract/screens/customer-profile.md`
- `.spec/ui-contract/screens/customer-orders.md`
- `.spec/ui-contract/screens/customer-order-detail.md`
- `.spec/ui-contract/screens/wishlist.md`
- `.spec/ui-contract/screens/loyalty.md`
- `.spec/ui-contract/screens/customer-notifications.md`
- `.spec/ui-contract/screens/customer-reviews.md`
- `.spec/ui-contract/screens/admin-dashboard.md`
- `.spec/ui-contract/screens/admin-products.md`
- `.spec/ui-contract/screens/admin-catalog.md`
- `.spec/ui-contract/screens/admin-media.md`
- `.spec/ui-contract/screens/admin-inventory.md`
- `.spec/ui-contract/screens/admin-orders.md`
- `.spec/ui-contract/screens/admin-payment-shipping.md`
- `.spec/ui-contract/screens/admin-customers.md`
- `.spec/ui-contract/screens/admin-promotions-coupons.md`
- `.spec/ui-contract/screens/admin-reviews-blog.md`
- `.spec/ui-contract/screens/admin-notifications.md`
- `.spec/ui-contract/screens/admin-analytics.md`
- `.spec/ui-contract/screens/admin-ai.md`
- `.spec/ui-contract/screens/admin-users-staff-settings.md`

## Updated / Đã cập nhật

- `README.md`
- `.spec/README.md`
- `docs/README.md`
- `docs/01-folder-structure.md`
- `docs/06-ui-ux.md`
- `CAU_TRUC_THU_MUC.md`
- `TONG_HOP_DA_LAM.md`
- `CHANGELOG.md`
- `docs/18-framework-inventory.md`
- `docs/work-summaries/README.md`

## Not Changed / Không thay đổi

- Không thiết kế giao diện đẹp.
- Không tạo Figma hoặc wireframe hình ảnh.
- Không viết React.
- Không viết HTML/CSS.
- Không viết JavaScript/TypeScript.
- Không tạo component implementation.
- Không thay đổi frontend/backend runtime.

## Verification / Kiểm tra

- Kiểm tra `.spec/ui-contract` chỉ có Markdown.
- Kiểm tra có 32 screen contract.
- Kiểm tra các screen có đủ section bắt buộc của Prompt 11.
- Kiểm tra không có dấu hiệu React/HTML/CSS/Figma/code trong UI Contract.
- Kiểm tra Markdown bằng `git diff --check`.

## Notes / Ghi chú

Prompt Design System hoặc Frontend Development sau này nên đọc `.spec/ui-contract/README.md`, `navigation.md`, `screen-flow.md`, `component-mapping.md`, `state-contract.md` và screen contract liên quan trước khi triển khai.

