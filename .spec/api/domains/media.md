# Media API Specification / Đặc tả API media

## API Overview / Tổng quan API

Media API quản lý upload, attach, download, preview và archive media asset như ảnh sản phẩm, logo, chứng nhận, banner, blog media và file AI input.

## Endpoint List / Danh sách endpoint

| Method / Method | URI / URI | Purpose / Mục tiêu | Auth / Xác thực | Permission / Quyền |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/media/uploads/prepare` | Chuẩn bị upload file | JWT | `media:upload` |
| POST | `/api/v1/media/uploads/complete` | Xác nhận upload hoàn tất | JWT | `media:upload` |
| GET | `/api/v1/media/{mediaId}` | Xem metadata media | JWT hoặc Public theo visibility | Scope theo media |
| GET | `/api/v1/media/{mediaId}/download` | Lấy download URL | JWT hoặc Public theo visibility | Scope theo media |
| GET | `/api/v1/admin/media` | Danh sách media admin | Staff JWT | `media:read` |
| PATCH | `/api/v1/admin/media/{mediaId}` | Cập nhật metadata media | Staff/Manager JWT | `media:manage` |
| PATCH | `/api/v1/admin/media/{mediaId}/visibility` | Đổi visibility | Manager/Admin JWT | `media:manage` |
| DELETE | `/api/v1/admin/media/{mediaId}` | Archive/xóa mềm media | Manager/Admin JWT | `media:manage` |

## REST Resource / Tài nguyên REST

- Primary resource: `media`.
- Action resources: `uploads/prepare`, `uploads/complete`, `download`, `visibility`.

## HTTP Method / Phương thức HTTP

- POST cho upload prepare/complete.
- GET cho metadata/download URL.
- PATCH cho metadata/visibility.
- DELETE cho archive/xóa mềm.

## URI Convention / Quy ước URI

- Shared namespace: `/api/v1/media`.
- Admin namespace: `/api/v1/admin/media`.
- ID parameter dùng `{mediaId}`.

## Version / Phiên bản

- API version: `v1`.
- Contract version: `v1`.

## Permission / Quyền

- `media:upload` cho upload.
- `media:read` cho admin list.
- `media:manage` cho update/archive.
- Public media chỉ đọc được khi visibility là public.

## Authentication / Xác thực

- Upload bắt buộc JWT.
- Public download chỉ cho public asset.
- Private/signed download bắt buộc JWT và scope.

## Authorization / Phân quyền

- Actor chỉ attach/download private media nếu có quyền với owner resource.
- Storage key không trả public.
- File AI input tuân thủ AI privacy và retention.

## Request Contract / Contract request

- Upload prepare/complete dùng [File Transfer Contract](../../data-contracts/file-transfer-contract.md).
- Metadata update dùng command input.
- Visibility update dùng action request.

## Response Contract / Contract response

- Media asset summary.
- File URL metadata gồm public URL hoặc signed URL, content type, size và expiresAt nếu cần.
- Không trả local path hoặc storage key public.

## Error Contract / Contract lỗi

- `VALIDATION.MEDIA.INVALID_FILE_TYPE`
- `VALIDATION.MEDIA.FILE_TOO_LARGE`
- `BUSINESS.MEDIA.SCAN_FAILED`
- `NOT_FOUND.COMMON.RESOURCE_NOT_FOUND`

## Validation Rule / Quy tắc validation

- Kiểm tra fileName, contentType, sizeBytes, checksum, purpose, ownerType, ownerId, visibility.
- Chỉ cho content type theo purpose.
- Temporary upload cần expiresAt.

## Business Rule / Quy tắc nghiệp vụ

- Media public cần alt text nếu dùng cho UI/SEO.
- File private phải dùng signed URL.
- Media đã gắn order/history không hard delete nếu làm mất dữ liệu tham chiếu.

## Pagination / Phân trang

- Admin media list dùng page pagination default 20, max 100.

## Filter / Lọc

- Lọc theo `purpose`, `ownerType`, `visibility`, `mediaStatus`, `createdAt`.

## Search / Tìm kiếm

- Search theo fileName, altText, owner reference nếu có quyền.

## Sort / Sắp xếp

- Default sort: `createdAt` desc.

## Upload / Upload

- Upload prepare và complete là trọng tâm domain này.
- Upload lớn hoặc private dùng Cost Strict rate limit.

## Download / Download

- Download endpoint trả file URL metadata, không stream file ở Prompt 10.
- Signed URL cần `expiresAt`.

## Rate Limit / Giới hạn gọi API

- Upload/download private: Cost Strict.
- Public media read: Public Normal nếu asset public.

## Idempotency / Chống gửi lặp

- Upload complete cần chống gửi lặp bằng checksum/upload token.

## Webhook / Webhook

Không áp dụng trong Prompt 10. Storage provider callback nếu có sẽ thuộc Integration Gateway sau này.

## AI Endpoint / Endpoint AI

Media cung cấp AI input file theo scope. OCR/Vision xử lý qua AI API.

