# Prompt 15.5 - Resolve Authentication Decisions / Giải quyết quyết định Authentication

## Task / Nhiệm vụ

Giải quyết toàn bộ P0, cập nhật authoritative specifications/OpenAPI và chỉ mở khóa Authentication nếu validation đạt.

## Summary / Tóm tắt

Approved 10/10 P0: Argon2id/password policy, token lifetime/claims, opaque rotating refresh/reuse, Web cookie+CSRF/CORS, account protection, verified-account rule, dedicated responses/errors, Web/Mobile transport, single-tenant V1 và retention/privacy. Module chuyển `Ready for Implementation`.

## Added / File đã thêm

- `.spec/data-contracts/authentication-contract.md`.
- Dedicated Authentication schemas/responses/examples/security schemes trong `openapi/`.

## Updated / File đã cập nhật

- Authentication Data Contract index/changelog, API/flow/changelog, physical DB/changelog, UI contracts/changelog.
- `openapi/openapi.yaml`, shared schema/response/example/security files và OpenAPI ChangeLog.
- Authentication module decisions/security/database/API/frontend/status/report/checklist/acceptance/changelog/TODO/plan.
- Root `CHANGELOG.md`, `TONG_HOP_DA_LAM.md` và work-summary index.

## Not Changed / Không thay đổi

Không tạo hoặc sửa application code, SQL, migration, entity, shared TypeScript contract hay UI implementation. Không có secret thật.

## Verification / Kiểm tra

OpenAPI YAML parse, `$ref`, operationId uniqueness/count, project OpenAPI validator, docs/format/secret check và `git diff --check` được chạy sau cập nhật.

## Notes / Ghi chú

Task tiếp theo có thể bắt đầu migration/entity theo `modules/authentication/ImplementationPlan.md`; không được tự đổi approved policy.
