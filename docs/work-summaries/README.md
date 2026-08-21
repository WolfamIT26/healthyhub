# Work Summaries / Tổng hợp sau mỗi lần làm

## Purpose / Mục tiêu

Thư mục `docs/work-summaries` dùng để gom các file tổng hợp sau mỗi lần AI Agent hoàn thành một nhiệm vụ. Mục tiêu là giúp người đọc kiểm tra nhanh đã làm gì, file nào được thêm, file nào được cập nhật và còn gì cần chú ý.

## Naming Rule / Quy tắc đặt tên

Tên file dùng tiếng Anh theo quy tắc dự án:

```text
YYYY-MM-DD-NN-short-task-name.md
```

Ví dụ:

```text
2026-08-05-01-prompt-03-foundation-documentation.md
```

## Required Content / Nội dung bắt buộc

Mỗi file tổng hợp nên có:

- Task / Nhiệm vụ.
- Summary / Tóm tắt.
- Added / File hoặc thư mục đã thêm.
- Updated / File đã cập nhật.
- Not Changed / Phần không thay đổi.
- Verification / Kiểm tra đã chạy.
- Notes / Ghi chú cho lần sau.

## Summary Index / Danh sách file tổng hợp

- [Prompt 32.1 - Inventory Lifecycle & Stock Mutation Contract](2026-08-21-02-prompt-32-1-inventory-lifecycle-stock-mutation.md).
- [Prompt 32 - Inventory Authority V1](2026-08-21-01-prompt-32-inventory-authority-v1.md).
- [Prompt 31 - Product Backend / Catalog Authority V1](2026-08-13-01-prompt-31-product-backend-catalog-authority-v1.md).
- [Prompt 30 - Wishlist Persistence V1](2026-08-13-01-prompt-30-wishlist-persistence-v1.md).
- [Prompt 29 - Customer Profile & Address V1](2026-08-13-01-prompt-29-customer-profile-address-v1.md).
- [Fix - Development Port Environment](2026-08-13-02-fix-development-port-environment.md).
- [Prompt 28 - Customer Orders V1](2026-08-13-01-prompt-28-customer-orders-v1.md).
- [Prompt 27.3 - VNPAY Sandbox E2E Verification](2026-08-12-01-prompt-27-3-vnpay-sandbox-e2e-verification.md).
- [Prompt 27.2 - VNPAY Sandbox Integration](2026-08-10-01-prompt-27-2-vnpay-sandbox-integration.md).
- [Prompt 03 - Foundation Documentation](2026-08-05-01-prompt-03-foundation-documentation.md).
- [Work Summary System](2026-08-05-02-work-summary-system.md).
- [Prompt 04 - AI Development Core](2026-08-05-03-prompt-04-ai-development-core.md).
- [Prompt 05 - Business Blueprint](2026-08-06-01-prompt-05-business-blueprint.md).
- [Prompt 06 - Feature Specifications](2026-08-06-02-prompt-06-feature-specifications.md).
- [Prompt 07 - Domain Model](2026-08-06-03-prompt-07-domain-model.md).
- [Prompt 08 - Logical Database Design](2026-08-06-04-prompt-08-logical-database-design.md).
- [Prompt 09 - Physical Database Design](2026-08-06-05-prompt-09-physical-database-design.md).
- [Prompt 09.5 - Data Contract Specification](2026-08-06-06-prompt-09-5-data-contract-specification.md).
- [Prompt 10 - API Specification](2026-08-06-07-prompt-10-api-specification.md).
- [Prompt 11 - UI Contract Specification](2026-08-06-08-prompt-11-ui-contract-specification.md).
- [Prompt 12 - Design System](2026-08-06-09-prompt-12-design-system.md).
- [Prompt 12.5 - Development Standards](2026-08-06-10-prompt-12-5-development-standards.md).
- [Prompt 13 - OpenAPI Specification](2026-08-06-11-prompt-13-openapi-specification.md).
- [Prompt 14 - Implementation Foundation](2026-08-06-12-prompt-14-implementation-foundation.md).
- [Prompt 15 - Authentication Specification Mapping](2026-08-06-13-prompt-15-authentication-specification-mapping.md).
- [Prompt 15.5 - Resolve Authentication Decisions](2026-08-06-14-prompt-15-5-resolve-authentication-decisions.md).
- [Prompt 16 - Authentication Data and Shared Contracts](2026-08-06-15-prompt-16-authentication-data-shared-contracts.md).
- [Prompt 21 - Product Catalog V1](2026-08-09-01-prompt-21-product-catalog-v1.md).
- [Prompt 22 - Product Detail V1](2026-08-09-02-prompt-22-product-detail-v1.md).
- [Prompt 23 - Search & Product Discovery V1](2026-08-09-03-prompt-23-search-product-discovery-v1.md).
- [Prompt 24 - Wishlist V1](2026-08-09-04-prompt-24-wishlist-v1.md).
- [Prompt 25 - Shopping Cart V1](2026-08-09-05-prompt-25-shopping-cart-v1.md).
- [Prompt 25.5 - Cart Persistence Audit](2026-08-09-06-prompt-25-5-cart-persistence-audit.md).
- [Prompt 25.6 - Cart Dependency Enablement](2026-08-09-07-prompt-25-6-cart-dependency-enablement.md).
- [Prompt 25.7 - Cart Server Persistence](2026-08-09-08-prompt-25-7-cart-server-persistence.md).
- [Prompt 26 - Checkout Readiness Audit](2026-08-09-09-prompt-26-checkout-readiness-audit.md).
- [Prompt 26.1 - Checkout Dependency Enablement](2026-08-09-10-prompt-26-1-checkout-dependency-enablement.md).
- [Prompt 26.1A - Shipping Authority Foundation](2026-08-09-11-prompt-26-1a-shipping-authority-foundation.md).
- [Prompt 26.1B - Order Creation Boundary](2026-08-09-12-prompt-26-1b-order-creation-boundary.md).
- [Prompt 26.2 - Checkout V1](2026-08-09-13-prompt-26-2-checkout-v1.md).
- [Prompt 27 - Payment Readiness & Provider Boundary](2026-08-09-14-prompt-27-payment-readiness-provider-boundary.md).
- [Prompt 27.1 - Payment Contract Resolution](2026-08-09-15-prompt-27-1-payment-contract-resolution.md).
- [Fix - Cart AccessTokenGuard Dependency Resolution](2026-08-09-16-fix-cart-access-token-guard-dependency.md).

## Usage Rule / Quy tắc sử dụng

Sau mỗi lần làm xong, AI Agent phải tạo một file mới trong thư mục này. File tổng hợp không thay thế `Status.md`, `Report.md`, `Checklist.md` hoặc `ChangeLog.md`; nó là bản gom nhanh để người dùng dễ kiểm tra.
