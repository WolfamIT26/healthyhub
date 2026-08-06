# Checklist / Checklist Authentication

## Specification Mapping / Ánh xạ đặc tả

- [x] Scope V1 và out-of-scope được chuẩn hóa.
- [x] Guest, Customer, Staff, Manager, Administrator, Super Admin được mapping.
- [x] Public/authenticated/role/permission/admin-only được phân biệt.
- [x] 11 flow (gồm account lock và session revocation) có pre/input/process/output/security/failure/audit/rate limit.
- [x] 4 Authentication tables và User-domain ownership được mapping.
- [x] 10 Authentication endpoints + adjacent status/RBAC APIs được mapping.
- [x] Login/Register/Forgot/Reset/Verify/session-expired/401/403 UI được mapping.
- [x] Shared request/response/token/session/role/permission/error types được liệt kê.
- [x] Implementation plan có 18 task, allowlist, dependency, acceptance và command.

## Security / Bảo mật

- [x] Hashing, token lifecycle/rotation/storage/revoke, one-time token và constant-time requirement được ghi.
- [x] Brute-force, attempt tracking, lock, generic error, redaction và audit được ghi.
- [x] Cookie/CORS/CSRF options và blocker được ghi; không tạo secret/value production.
- [x] P0 policy values và transport được phê duyệt trong Prompt 15.5.

## Conflict & Governance / Mâu thuẫn và quản trị

- [x] Conflict/gap nằm trong `Report.md` và pending decisions trong `Decision.md`.
- [x] Blockers được đánh dấu trong `Status.md`.
- [x] Chỉ đưa một phương án ưu tiên cho mỗi pending decision.
- [x] Không sửa Business Blueprint, DB spec, API spec hoặc OpenAPI.
- [x] Không tạo code, SQL, migration, entity hoặc UI implementation.
- [x] Module index và work-summary index được cập nhật.
- [x] `git diff --check` sạch.

## Unlock / Mở khóa

- [x] 10/10 P0 decisions Approved, không còn blocker migration/code.
- [x] Data Contract/Auth API/flow/physical DB/UI/OpenAPI được cập nhật đúng authority.
- [x] Web cookie/CSRF/CORS và Mobile refresh header được chốt.
- [x] Response/error/request/security schemes và examples đồng bộ.
- [x] OpenAPI YAML, refs, 194 operationIds và operation count hợp lệ.
- [x] Status là `Ready for Implementation`.

## Implementation / Triển khai

- [ ] Database/shared/backend/frontend/tests được triển khai theo plan.
- [ ] Security review hoàn tất.
- [ ] Acceptance đủ và module lock.
