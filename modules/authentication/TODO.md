# TODO / Việc cần làm Authentication

## Ready Implementation Queue / Hàng đợi triển khai

- [x] Fix runtime login overflow: normalize raw User-Agent thành browser/client family trước khi ghi login attempt.

- [x] Task 1 implementation: migration/entity theo physical spec đã duyệt.
- [ ] Task 1 verification: chạy migration up/down và constraint integration khi Docker/MySQL sẵn sàng.
- [x] Task 2: shared auth contracts theo Data Contract/OpenAPI.
- [ ] Task 3–12: backend security/flows/RBAC và frontend forms/guards.
- [ ] Task 13–16: unit, integration, E2E và security review.
- [ ] Task 17–18: documentation update và module lock.

## P1 Backlog / P1

- [ ] Dedicated UI screen contract cho change-password/403 nếu cần tách file.
- [ ] Device/session management UI và revoke selected session.
- [ ] Tune Argon2/rate thresholds from production performance evidence without weakening baseline.

## Future Enhancement / Tương lai

- [ ] Staged multi-tenant migration and Super Admin platform scope.
- [ ] MFA for privileged users, social login, SSO and breached-password external integration only after new specification/security decision.

No P0 item remains.
