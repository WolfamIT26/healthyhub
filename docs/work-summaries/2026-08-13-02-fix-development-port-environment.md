# Fix - Development Port Environment / Sửa môi trường port development

## Task / Nhiệm vụ

Đưa cấu hình Web/API development về một authority duy nhất là `.env.development`, bỏ
hard-code port runtime và giữ nguyên toàn bộ business logic/API contract.

## Summary / Tóm tắt

- Web thực tế listen `3100`, do `WEB_PORT` điều khiển.
- API thực tế listen `3001`, do `API_PORT` đi qua `HealthyHubEnvironment` điều khiển.
- `APP_URL`, `VITE_API_BASE_URL`, `CORS_ORIGINS` và `AUTH_ALLOWED_ORIGINS` resolve đúng
  lần lượt về Web `3100` và API `/api/v1` tại `3001`.
- Vite bật `strictPort`; lần bind thứ hai trả rõ `Port 3100 is already in use`, không tự
  nhảy sang port API.

## Root Cause / Nguyên nhân

`WEB_PORT` trước đây không có tác dụng vì `apps/web/package.json` truyền
`--port 3000` và `vite.config.ts` đồng thời đặt `server.port`/`preview.port` là `3000`;
Vite cũng chưa trỏ `envDir` về workspace root. Khi `3000` bị chiếm, Vite cũ tự nhảy sang
`3001` vì chưa có `strictPort`.

API đã parse `API_PORT`, nhưng bootstrap đọc `process.env` trước khi `ConfigModule` nạp
file và đường dẫn env phụ thuộc working directory của npm workspace. Callback validate
còn trả object `HealthyHubEnvironment` lồng nhau, nên `@nestjs/config` không expose raw
keys cho các provider hiện hữu.

## Added / Đã thêm

- `apps/api/src/config/project-path.ts` và test để resolve workspace root dùng chung cho
  env/OpenAPI path.
- Work Summary này.

## Updated / Đã cập nhật

- Vite/Web public environment config, test setup và Web package scripts.
- NestJS AppModule/bootstrap/environment validation và related tests.
- Dockerfiles, Docker Compose, Docker startup check và root Docker scripts.
- `.env.example`, `.env.development.example` và sáu giá trị non-secret trong local
  `.env.development`.
- Implementation Foundation environment/setup/Docker/Status/Report/Checklist/ChangeLog,
  root README/ChangeLog/tổng hợp.

## Not Changed / Không thay đổi

- Authentication, Order, Payment, VNPAY, Shipping, Checkout và database business logic.
- API/OpenAPI contract, migrations và test fixtures/history dùng port riêng.
- Không ghi hoặc hard-code credential/secret.

## Verification / Kiểm tra

| Check | Result |
| --- | --- |
| Web listener `http://127.0.0.1:3100` | **PASS — HTTP 200** |
| Vite `strictPort` collision | **PASS — fail rõ tại 3100** |
| API listener `/api/v1/health/live` tại `3001` | **PASS — HTTP 200** |
| CORS preflight từ `http://localhost:3100` | **PASS — HTTP 204 / origin đúng** |
| Compose config với `.env.development` | **PASS — Web 3100:3100 / API 3001:3001** |
| API config/path tests | **PASS — 9 tests** |
| Workspace unit tests | **PASS — 260 tests** |
| Workspace lint | **PASS** |
| Workspace typecheck | **PASS** |
| Workspace build | **PASS** |
| Secrets/docs/diff checks | **PASS** |

## Notes / Ghi chú

- Đã dừng đúng Vite process cũ của HealthyHub vốn tự nhảy sang `3001`; không đụng
  process `3000` thuộc workspace khác.
- Sau này chỉ cần đổi `WEB_PORT`/`API_PORT` và các URL/origin tương ứng trong environment
  phù hợp; source không giữ listener port riêng.
