# Acceptance / Tiêu chí chấp nhận Authentication V1

## Functional / Chức năng

- [ ] Guest đăng ký Customer bằng email/password; privileged role injection bị từ chối.
- [ ] Eligible account login tạo session; credential/account state sai bị từ chối an toàn.
- [ ] Refresh rotation hoạt động atomically; token cũ/revoked/reused không dùng lại được.
- [ ] Logout idempotent và session không refresh được sau revoke.
- [ ] Forgot response không tiết lộ account; reset token hết hạn/dùng lại bị từ chối.
- [ ] Email verification thực thi vì V1 sources hiện yêu cầu.
- [ ] Session response có actor, roles, effective permissions và metadata đã chuẩn hóa.
- [ ] Change/reset/lock thu hồi session theo policy đã phê duyệt.
- [ ] Backend enforce role/permission và tenant/owner; Admin status yêu cầu `users:manage`.

## Security & Quality / Bảo mật và chất lượng

- [ ] Không lưu/log/return password hash hoặc raw access/refresh/reset/verify token ngoài token delivery được phê duyệt.
- [x] Password KDF, TTL, lock, cookie/CSRF và retention có quyết định được duyệt ở mức specification.
- [x] Endpoint auth có tier rate limit và login attempt/audit contract đầy đủ.
- [x] 401/403 và error code khớp contract; lỗi tiếng Việt không enumeration.
- [ ] Unit/integration/E2E/security tests pass; OpenAPI conformance pass.
- [ ] UI accessible/responsive; session-expired không loop; forbidden không logout.
- [ ] Lint/typecheck/test/docs/secrets/OpenAPI checks và `git diff --check` sạch.

## Documentation Gate / Cổng tài liệu

- [x] 10/10 Authentication endpoints được mapping.
- [x] 4/4 Authentication tables được mapping.
- [x] Login/Register/Forgot/Reset/Verify/session-expired/unauthorized/forbidden được mapping.
- [x] Actor, permission và security controls được liệt kê.
- [x] Không tạo code, SQL, migration, entity hoặc UI.

## Unlock Gate / Cổng mở khóa

- [x] 10/10 P0 decisions Approved.
- [x] Database mapping không còn mâu thuẫn V1.
- [x] Data Contract, API Specification, UI Contract và OpenAPI đồng bộ.
- [x] OpenAPI operation count/uniqueness/refs validation đạt.
- [x] Module chuyển `Ready for Implementation`.
