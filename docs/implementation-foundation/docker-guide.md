# Docker Guide / Hướng dẫn Docker

## Purpose / Mục tiêu

Docker Guide mô tả cách chạy foundation bằng Docker Compose. Compose hiện phục vụ local development và kiểm tra nền, chưa phải cấu hình production cuối cùng.

## Services / Dịch vụ

| Service | Container | Port mặc định | Mục tiêu |
| --- | --- | --- | --- |
| `mysql` | `healthyhub-mysql` | `3306` | MySQL 8.0 local |
| `api` | `healthyhub-api` | `${API_PORT}` (`3001` ở development) | NestJS API foundation |
| `web` | `healthyhub-web` | `${WEB_PORT}` (`3100` ở development) | React/Vite web shell |
| `phpmyadmin` | `healthyhub-phpmyadmin` | `8080` | Quản trị MySQL bằng UI |

## Commands / Lệnh

Chạy toàn bộ stack:

```bash
npm run docker:up
```

Kiểm tra endpoint nền:

```bash
npm run docker:check
```

Dừng stack:

```bash
npm run docker:down
```

Ba script trên đọc `.env.development` tại workspace root. Compose không giữ một port
Web/API riêng: listener, port mapping và healthcheck đều dùng `WEB_PORT`/`API_PORT`.

## Health Checks / Kiểm tra sức khỏe

- MySQL dùng `mysqladmin ping`.
- API dùng `GET /api/v1/health/live` trên `API_PORT`.
- Web dùng request tới `http://127.0.0.1:${WEB_PORT}`.
- phpMyAdmin dùng request nội bộ tới trang chủ container.

## Volume and Network / Volume và network

- Volume `healthyhub_mysql_data` lưu dữ liệu MySQL local.
- Network `healthyhub-network` tách riêng các service HealthyHub.
- `database/schemas` được mount read-only vào MySQL init folder để chuẩn bị schema script sau này.

## Safety Rule / Quy tắc an toàn

- Compose chỉ dùng giá trị mẫu hoặc biến môi trường local.
- Không đưa secret production vào image.
- Không dùng `TYPEORM_SYNCHRONIZE=true` trong Docker development mặc định.
- Nếu Docker build lỗi vì thiếu dung lượng ổ đĩa, ghi nhận trong `Report.md` thay vì báo đã chạy thành công.
