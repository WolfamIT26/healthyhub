# UI Contract Index / Mục lục UI Contract

## Purpose / Mục tiêu

Thư mục `.spec/ui-contract` định nghĩa UI Contract cho HealthyHub dựa trên Business Blueprint, Data Contract và API Specification.

UI Contract là tài liệu trung gian giữa API Specification, Design System và Frontend Development. Prompt 11 không thiết kế giao diện đẹp, không tạo Figma, không viết React, không viết HTML/CSS và không sinh code.

## Reading Order / Thứ tự đọc

1. [UI Contract Standards / Chuẩn UI Contract](ui-contract-standards.md).
2. [Navigation / Điều hướng](navigation.md).
3. [Screen Flow / Luồng màn hình](screen-flow.md).
4. [Component Mapping / Mapping component](component-mapping.md).
5. [UI State Contract / Chuẩn trạng thái UI](state-contract.md).
6. [Screen Index / Danh sách màn hình](screens/README.md).

## Input References / Tài liệu đầu vào

- [Foundation Documentation](../../docs/foundation/README.md).
- [AI Development Core](../../.ai/README.md).
- [Business Blueprint](../../docs/business-blueprint/README.md).
- [Feature Specifications](../features/README.md).
- [Domain Model](../domain/README.md).
- [Data Contract Specification](../data-contracts/README.md).
- [API Specification](../api/README.md).

## Screen Groups / Nhóm màn hình

| Group / Nhóm | Screens / Màn hình |
| --- | --- |
| Public | Home, Product List, Product Detail, Blog List, Blog Detail, AI Assistant public-safe |
| Authentication | Login, Register, Verify Email, Forgot Password, Reset Password |
| Customer | Cart, Checkout, Profile, Addresses, Orders, Order Detail, Wishlist, Loyalty, Notifications, Reviews |
| Admin/Staff | Dashboard, Products, Catalog, Media, Inventory, Orders, Payment/Shipping, Customers, Promotions/Coupons, Reviews, Blog, Notifications, Analytics, AI, Users/Staff/Settings |

## Output Rule / Quy tắc đầu ra

- Chỉ tạo UI Contract bằng Markdown.
- Không tạo wireframe hình ảnh hoặc Figma.
- Không viết React, HTML, CSS, JavaScript hoặc TypeScript.
- Không tạo component implementation.
- Không thêm nghiệp vụ mới ngoài Business Blueprint và API Specification.

## Status Files / File trạng thái

- [Status](Status.md).
- [Report](Report.md).
- [Checklist](Checklist.md).
- [ChangeLog](ChangeLog.md).

