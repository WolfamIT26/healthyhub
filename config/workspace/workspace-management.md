# Workspace Management / Quản lý monorepo

## Rule / Quy tắc

- Root `package.json` khai báo npm workspaces cho `apps/*` và `packages/*`.
- `apps/web`, `apps/api`, `apps/mobile` là application workspace.
- `packages/shared` là package workspace dùng chung.
- Không thêm tool monorepo mới nếu chưa có ADR.

## Current Status / Trạng thái hiện tại

Chỉ scaffold workspace. Chưa có package riêng cho từng app.

