# Prompt 34 - Admin Foundation & Access Control V1

## Task / Nhiệm vụ

Triển khai Admin access control, application shell, route protection, minimal authoritative Dashboard và reusable security/API foundation trên canonical Authentication/User/Product/Inventory/Order/Review contracts. Không mở full Admin CRUD hoặc Prompt 35.

## Result / Kết quả

| Boundary / Ranh giới | Result / Kết quả |
| --- | --- |
| Admin Authentication | **READY** |
| Admin Authorization | **READY** |
| Admin API Foundation | **READY** |
| Admin Route Protection | **PASS** |
| Admin Layout | **READY** |
| Admin Dashboard | **READY** |
| Review Moderation Unblock | **BLOCKED** |
| Ownership/Tenant Security | **PASS** |
| Regression | **PASS** |

## Implemented / Đã triển khai

- Tăng cường `AccessTokenGuard`: verify JWT rồi recheck session owner/status/expiry, account status/deletion, current persisted roles và permission version.
- Reuse roles `STAFF|MANAGER|ADMINISTRATOR`; thêm canonical `analytics:read` permission cho ba Internal roles qua seed idempotent, không tạo Admin account/credential.
- Mở operation có sẵn `GET /api/v1/admin/analytics/dashboard` với role + permission guards và typed response.
- Tạo responsive Admin sidebar/drawer, header actor/role, logout, content boundary và Dashboard loading/error/retry/forbidden/empty states.
- Dashboard là navigation executable duy nhất; Products/Inventory/Orders/Reviews disabled kèm blocker, không có CRUD giả.

## Authorization Model / Mô hình phân quyền

Guest không có persisted role. Customer không vào Admin. Internal actor phải có Bearer session hợp lệ, account theo policy, current Internal role và effective `analytics:read`. Role claim cũ/giả trong JWT không vượt được persisted role hiện hành; backend là final authority.

Pending unverified Customer policy hiện hữu vẫn được giữ cho Customer routes; pending/disabled/locked Internal actor không thể dùng Admin boundary.

## Dashboard Authority / Authority Dashboard

- Product: total chưa soft-delete, active+public và public unavailable/out-of-stock theo Product + Inventory authority.
- Order: total và counts cho `new|confirmed|completed|cancelled|returned`.
- Review: total và counts cho `published|hidden|rejected`.
- Không có revenue, profit, conversion, growth, best-selling, chart/time-series hoặc pending moderation.
- Không expose Customer PII, provider payload, secret, raw audit fields hoặc tenant selector client-controlled.

## Database / Migration

- Không có schema migration; migration state vẫn **16/16 applied**.
- Reuse tenant đơn V1 `tenantId = 1` phía server và các domain tables hiện hữu.
- Canonical seed đã chạy idempotently để bổ sung `analytics:read`; không seed credential.

## Testing / Kiểm thử

- Backend: Guest/Customer/Internal, disabled/locked/pending policy, stale/forged role claim, current permission metadata, typed aggregate và no-PII/no-fake metrics.
- Frontend: Admin access, Customer forbidden, reload restoration, navigation availability, dashboard loading/error/retry/empty/authoritative render, logout và account-switch isolation.
- MySQL: tenant isolation và aggregate delta thật trên Product/Inventory/Order/Review.

## Verification / Kiểm tra

- Format check: **PASS**.
- Lint: **PASS**.
- Typecheck: **PASS**.
- Unit tests: **PASS — API 232 + Web 152 = 384 tests**.
- MySQL integration: **PASS — 13 files / 26 tests**, chạy sequential với toàn bộ opt-in flags.
- Migration state: **PASS — 16/16 applied**.
- Build: **PASS**.
- OpenAPI: **PASS — 196 operations / 196 unique IDs / 196 spec rows**.
- Secrets/docs/diff checks: **PASS**.

## Remaining Blockers / Blocker còn lại

Admin Review moderation vẫn `ADMIN_REVIEW_MODERATION_NOT_IMPLEMENTED`: chưa có canonical reason requirement, re-publish behavior, moderation audit và pending lifecycle. Foundation Prompt 34 không tự phát minh policy này.

## Not Changed / Không thay đổi

- Không Admin Product/Category/Brand CRUD, Inventory adjustment, Order/shipping management, refund, Customer/user/role management UI hoặc analytics tài chính.
- Không đổi Payment/Fulfillment/Inventory/Review public-customer lifecycle authority.
- Không thêm audit system mới; Dashboard read-only không tạo durable audit noise.
- Không commit, push, merge hoặc bắt đầu Prompt 35.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
