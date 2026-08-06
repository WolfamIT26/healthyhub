# Docker Guide / Hướng dẫn Docker

## Purpose / Mục tiêu

Docker Guide mô tả cách chạy foundation bằng Docker Compose. Compose hiện phục vụ local development và kiểm tra nền, chưa phải cấu hình production cuối cùng.

## Services / Dịch vụ

| Service | Container | Port mặc định | Mục tiêu |
| --- | --- | --- | --- |
| `mysql` | `healthyhub-mysql` | `3306` | MySQL 8.0 local |
| `api` | `healthyhub-api` | `3001` | NestJS API foundation |
| `web` | `healthyhub-web` | `3000` | React/Vite web shell |
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

## Health Checks / Kiểm tra sức khỏe

- MySQL dùng `mysqladmin ping`.
- API dùng `GET /api/v1/health/live`.
- Web dùng request tới `http://127.0.0.1:3000`.
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
