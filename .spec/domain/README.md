# Domain Model / Mô hình Domain

## Purpose / Mục tiêu

Thư mục `.spec/domain` chứa Domain Model cấp nghiệp vụ cho HealthyHub. Đây là nền tảng trực tiếp cho các prompt Database Design, API Design và Module Development sau này.

## Scope / Phạm vi

Domain Model chỉ mô tả khái niệm nghiệp vụ, aggregate, entity, value object, enum, business rule, event, dependency và boundary. Không tạo database, không tạo API, không viết code, không tạo frontend/backend.

## Reading Order / Thứ tự đọc

1. [Domain Overview / Tổng quan domain](domain-overview.md)
2. [Domain Dependency Map / Bản đồ phụ thuộc domain](domain-dependency-map.md)
3. [Ubiquitous Language / Ngôn ngữ chung](ubiquitous-language.md)
4. [Business Constraints / Ràng buộc nghiệp vụ](business-constraints.md)
5. [Domains Index / Danh sách domain](domains/README.md)

## Domain Groups / Nhóm domain

| Group / Nhóm | Domains / Domain |
| --- | --- |
| Identity & Access | Authentication, User, Staff, Settings |
| Customer & Growth | Customer, Loyalty, Coupon, Promotion, Review |
| Catalog | Product, Category, Brand, Media, Blog |
| Commerce | Inventory, Cart, Wishlist, Order, Payment, Shipping |
| Intelligence & Operations | AI, Analytics, Notification |

## Status Files / File trạng thái

- [Status](Status.md)
- [Report](Report.md)
- [Checklist](Checklist.md)
- [ChangeLog](ChangeLog.md)

