# Prompt 31 - Product Backend / Catalog Authority V1

## Task / Nhiệm vụ

Hoàn thiện Product public persistence/API và chuyển Catalog, Product Detail, Search discovery khỏi frontend presentation authority; giữ UX Prompt 21–23, Cart/Wishlist compatibility và không mở Prompt 32.

## Result / Kết quả

| Boundary / Ranh giới | Result / Kết quả |
| --- | --- |
| Product Persistence | **READY** |
| Product Public API | **READY** |
| Catalog Server Integration | **PASS** |
| Product Detail Server Integration | **PASS** |
| Search Server Integration | **PASS** |
| Inventory Availability Integration | **PASS** |
| Cart/Wishlist Regression | **PASS** |

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`

## Implemented / Đã triển khai

- Product/Category/Brand/Content/Ingredient/Dietary/Nutrition/Media entities và three forward/reversible MySQL migrations.
- Public Product list/detail/options, Category list/tree/detail và Brand list/detail typed API.
- Server pagination, keyword/ingredient search, Category/Brand/dietary/price/availability filter và featured/newest/name/price sort.
- Product active/public + primary Category visibility, one-active-primary DB constraint và Inventory-derived availability/sellable mapping.
- Server-backed Catalog/Detail, debounced/cancellable Search suggestions và production removal of typed catalog authority.

## Security / Bảo mật

- Query whitelist/limits và invalid price/identifier validation chạy server-side.
- Public response không chứa cost, supplier, audit metadata, Inventory quantity hoặc raw storage key; chỉ public active HTTP(S) Product images được phép trả.
- Hidden/private/inactive/deleted Product không hiện ở list/detail; frontend không gửi price/stock/sellable authority.
- Rating/best-selling không được fake khi Review/sales read model chưa executable.

## Verification / Kiểm tra

- API unit: **PASS — 177 tests**.
- Web unit: **PASS — 131 tests**.
- Full workspace unit: **PASS — 308 tests**.
- MySQL integration sequential: **PASS — 10 files / 13 tests**.
- Workspace format/lint/typecheck/build: **PASS**.
- OpenAPI validation: **PASS — 196 operations / 196 spec rows**.
- API startup/public list/detail/Category/Brand smoke: **PASS**.
- Secrets/documentation checks và `git diff --check`: **PASS**.
- Final migration state: **PASS — 13/13 migrations applied**.

## Not Changed / Không thay đổi

- Không Admin Product CRUD, upload, Inventory mutation, Review, Promotion/Coupon, recommendation/AI hoặc Supplier management.
- Không đổi Authentication, Customer, Orders, Checkout, Payment/VNPAY business behavior.
- Homepage featured fixture remains a transparent presentation foundation outside the requested Catalog/Detail/Search production paths.

## Stop Boundary / Điểm dừng

Prompt 31 hoàn tất và dừng; không bắt đầu Prompt 32.
