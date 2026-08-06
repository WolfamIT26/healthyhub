# Feature Specifications / Đặc tả tính năng

## Purpose / Mục tiêu

Thư mục `.spec/features` chứa đặc tả chi tiết cho từng feature của HealthyHub. Đây là đầu vào cho các prompt sau như Database Design, API Design, UI Design và Module Development.

## Scope / Phạm vi Prompt 06

Prompt 06 chỉ tạo đặc tả nghiệp vụ cho feature. Không tạo database, không tạo API, không tạo frontend, không tạo backend và không viết code.

## Feature Groups / Nhóm feature

| Group / Nhóm | Features / Tính năng |
| --- | --- |
| Account & User | `authentication`, `users`, `customers` |
| Catalog | `products`, `categories`, `brands`, `media` |
| Commerce | `inventory`, `cart`, `wishlist`, `orders`, `payment`, `shipping` |
| Growth | `coupons`, `promotions`, `loyalty`, `reviews`, `blog` |
| Operations | `notifications`, `analytics`, `dashboard`, `settings` |
| AI | `ai-platform`, `ai-chat`, `ai-recommendation`, `ai-search`, `ai-compare`, `ai-ocr`, `ai-vision`, `ai-meal-planner`, `ai-calories`, `ai-marketing`, `ai-analytics`, `ai-customer-support` |

## Required Sections / Mục bắt buộc mỗi feature

- Overview / Tổng quan
- Business Goal / Mục tiêu kinh doanh
- Scope / Phạm vi
- Requirement / Yêu cầu
- User Story / User story
- Use Case / Use case
- Business Flow / Luồng nghiệp vụ
- Validation Rule / Quy tắc validation
- Permission / Phân quyền
- Acceptance Criteria / Tiêu chí hoàn thành
- Edge Cases / Trường hợp biên
- Error Cases / Trường hợp lỗi
- Future Enhancement / Mở rộng tương lai

## Status Files / File trạng thái

- [Status](Status.md)
- [Report](Report.md)
- [Checklist](Checklist.md)
- [ChangeLog](ChangeLog.md)
