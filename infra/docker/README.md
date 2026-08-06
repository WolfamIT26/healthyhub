# Docker Foundation / Nền tảng Docker

## Services / Dịch vụ

- `web`: React + Vite preview server.
- `api`: NestJS API foundation.
- `mysql`: MySQL 8 local database.
- `phpmyadmin`: giao diện quản trị MySQL local.

## Commands / Lệnh

- `npm run docker:up`: build và chạy toàn bộ service.
- `npm run docker:check`: kiểm tra web, API health và phpMyAdmin.
- `npm run docker:down`: dừng service.

Không đưa secret thật vào image hoặc `docker-compose.yml`.
