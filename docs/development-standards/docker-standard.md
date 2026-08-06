# Docker Standard / Chuẩn Docker

## Purpose / Mục tiêu

Docker và Docker Compose dùng để chuẩn hóa môi trường phát triển, database MySQL, phpMyAdmin, API foundation và Web foundation. Dockerfile hiện có cho `apps/api` và `apps/web`.

## Compose Rule / Quy tắc Docker Compose

- Service phải có tên rõ nghĩa.
- Port không được xung đột với service hiện có.
- Volume dữ liệu local phải được ghi chú.
- Environment dùng example hoặc biến local, không hardcode secret production.
- MySQL và phpMyAdmin là công cụ development hiện tại.

## Image Build Rule / Quy tắc build image

- Build context phải nhỏ và đúng app.
- Không copy secret vào image.
- Dependency install phải reproducible theo package manager đã chọn.
- Production image sau này cần tách khỏi dev-only tooling.

## Runtime Rule / Quy tắc runtime

- Container phải có health check nếu là service quan trọng.
- Log container không chứa token/password/secret.
- Không mount thư mục chứa dữ liệu nhạy cảm nếu không cần.

## Documentation Rule / Quy tắc tài liệu

Khi thay đổi Docker/Compose, cập nhật `docker-compose.yml`, `config/docker`, `deployment/docker`, `docs/development-standards/docker-standard.md` nếu cần và ChangeLog.

## Implementation Foundation Mapping / Mapping nền tảng triển khai

Tài liệu vận hành Docker cho Prompt 14 nằm tại [Implementation Docker Guide](../implementation-foundation/docker-guide.md).
