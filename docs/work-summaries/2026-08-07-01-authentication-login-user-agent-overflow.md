# Authentication Login — user_agent_family overflow fix

## Root cause

`AuthenticationController` chuyển raw `User-Agent` vào context và `AuthenticationService.recordAttempt()` dùng `slice(0, 120)`, nhưng `login_attempts.user_agent_family` là `VARCHAR(100)` trong cả entity và migration.

## Fix

- Chuẩn hóa thành `Chrome`, `Safari`, `Firefox`, `Edge` hoặc `Unknown`.
- Giới hạn phòng vệ 32 ký tự trước persistence.
- Giữ nguyên login-attempt audit cho success/failed/blocked paths.
- Không sửa policy, OpenAPI, migration/schema và không thêm dependency.

## Verification

Regression tests bao phủ Chrome dài, Safari, Firefox, thiếu User-Agent, input bất thường/rất dài, Edge precedence và failed-login attempt persistence.

- Root lint: pass.
- Workspace typecheck: pass.
- Authentication tests: 4 files / 18 tests pass.
- API tests: 8 files / 26 tests pass.
- Root build: pass.
- `git diff --check`: pass.
