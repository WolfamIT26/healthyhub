# Prompt 30 - Wishlist Persistence V1 / Wishlist persistence phía server

## Task / Nhiệm vụ

Chuyển Wishlist Prompt 24 từ transient React state sang server persistence thật, owner-only, giữ UX hiện hữu và không mở sharing/notification/recommendation/AI hoặc Prompt 31.

## Result / Kết quả

| Boundary / Ranh giới | Result / Kết quả |
| --- | --- |
| Wishlist Persistence | **READY** |
| Wishlist API | **READY** |
| Ownership/Security | **PASS** |
| Frontend Server Sync | **PASS** |
| Reload Persistence | **PASS** |
| Regression | **PASS** |

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`

## Implemented / Đã triển khai

- MySQL `wishlists`/`wishlist_items`, TypeORM entity/repository và migration Prompt 30.
- Customer-only typed GET/add/remove APIs; owner derive từ JWT → active CustomerProfile.
- Public Product validation, current Product/Inventory read model, out-of-stock/unavailable presentation.
- Customer row lock, DB uniqueness, active-item reuse và removed-item reactivation chống duplicate/concurrency.
- Server-backed `WishlistContext`, authoritative refetch, actor-keyed logout/login/account-switch isolation.
- Loading/error/retry/empty/list UX tại `/wishlist`; Catalog/Detail tiếp tục dùng shared `WishlistButton`.

## Security / Bảo mật

- API không nhận `customerId`; Guest bị AccessToken guard chặn, Internal bị Customer role/owner policy chặn.
- Foreign Wishlist item không thể đọc/sửa; not-owned item dùng 404 boundary.
- Response không expose Wishlist/customer internal ID, audit metadata hoặc sensitive account data.
- Không dùng `localStorage`/`sessionStorage`; logout không xóa Wishlist server.

## Verification / Kiểm tra

- API unit: **PASS — 167 tests**.
- Web unit: **PASS — 126 tests**.
- Full workspace unit: **PASS — 293 tests**.
- MySQL integration sequential: **PASS — 9 files / 12 tests**, gồm concurrent add/reload/owner isolation/remove/re-add Wishlist.
- Workspace lint/typecheck/build/format: **PASS**.
- OpenAPI validation: **PASS — 196 operations / 196 spec rows**.
- Secrets/documentation checks và `git diff --check`: **PASS**.
- API startup/Guest guard: **PASS — health 200, Wishlist không token 401**.
- Final migration state: **PASS — 10/10 migrations applied**.

## Not Changed / Không thay đổi

- Không Wishlist sharing/public, price notification, recommendation/AI, Product mutation hoặc Cart mutation mới.
- Không thay Authentication, Customer Profile, Orders, Checkout, Payment/VNPAY business behavior.

## Stop Boundary / Điểm dừng

Prompt 30 hoàn tất và dừng; không bắt đầu Prompt 31.
