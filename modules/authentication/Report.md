# Report / Báo cáo Authentication V1 Unlock

## Outcome / Kết quả

All former P0 blockers are resolved and Approved. Authentication Data Contract, API/flow, physical database, UI contracts and OpenAPI now share one V1 model. Module status is `Ready for Implementation`; no code, SQL, migration, entity or UI was created.

## Resolved Conflicts / Mâu thuẫn đã giải quyết

- Dedicated auth response schemas replace generic-only data; canonical dotted error codes are documented.
- Refresh request body removed. Web cookie+CSRF and Mobile header are explicit alternatives on one endpoint.
- Refresh hash/family/generation/reuse schema and bounded retention/privacy are defined.
- Email-only/global-unique single-tenant V1 removes identifier/tenant ambiguity.
- Password KDF/policy, token lifetime, account lock, verification behavior, RBAC/session revoke and idempotency are fixed.
- UI uses in-memory access, HttpOnly refresh, coordinated refresh and generic error handling.

## Compatibility / Tương thích

Routes, 10 operationIds and public contract `v1` remain unchanged. Changes clarify previously unimplemented shapes. Mobile-only refresh JSON is conditional and Web never receives it. Super Admin/multi-tenant/MFA/social remain future scope.

## Security Basis / Cơ sở bảo mật

Argon2id baseline follows OWASP Password Storage guidance; cookie/storage/session and CSRF controls follow OWASP guidance; rotation/reuse follows RFC 9700. Values are environment-configured and no real secret is present.

## Verification / Xác minh

OpenAPI validation reports 194 unique operations matching 194 spec rows. YAML parse, `$ref`, operationId uniqueness, docs/format/secret checks and `git diff --check` are recorded after final verification.
