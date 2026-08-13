# Wishlist Module / Module danh sách yêu thích

## Purpose / Mục tiêu

Wishlist lưu membership Product riêng của Customer trên server và trả current Product/Inventory presentation an toàn.

## Executable Scope / Phạm vi đã chạy

- Customer list/add/remove Wishlist qua `/api/v1/me/wishlist`.
- MySQL persistence với duplicate/concurrency protection.
- Frontend `/wishlist`, Catalog và Product Detail dùng chung server-backed context.

## Dependencies / Phụ thuộc

Authentication, active CustomerProfile, Product authority và Inventory availability.
