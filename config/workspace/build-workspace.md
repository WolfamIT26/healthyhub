# Build Workspace / Build toàn workspace

## Purpose / Mục tiêu

Chuẩn bị quy tắc build cho monorepo mà chưa thêm build tool mới.

## Rule / Quy tắc

- Root script dùng `npm run <script> --workspaces --if-present`.
- App/package nào chưa có script thì tự bỏ qua.
- Build thật sẽ được bổ sung khi frontend/backend bắt đầu triển khai.

