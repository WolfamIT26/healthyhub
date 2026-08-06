# Admin Media Screen / Màn hình quản lý media

## Screen Overview / Tổng quan màn hình

Admin Media quản lý upload, metadata, visibility, preview, download URL và archive media.

## Business Goal / Mục tiêu kinh doanh

Giúp quản lý ảnh sản phẩm, logo, chứng nhận, banner và file AI input an toàn.

## Route / Tuyến đường

| Route / Route | Purpose / Mục tiêu |
| --- | --- |
| `/admin/media` | Quản lý media. |

## Permission / Phân quyền

Staff đọc/upload theo scope; manager/admin quản lý visibility/archive.

## Required API / API bắt buộc

- `POST /api/v1/media/uploads/prepare`.
- `POST /api/v1/media/uploads/complete`.
- `GET /api/v1/admin/media`.
- `PATCH /api/v1/admin/media/{mediaId}`.
- `PATCH /api/v1/admin/media/{mediaId}/visibility`.
- `DELETE /api/v1/admin/media/{mediaId}`.
- `GET /api/v1/media/{mediaId}/download`.

## Required Data / Dữ liệu bắt buộc

Media asset summary, upload purpose, contentType, sizeBytes, visibility, public/signed URL metadata.

## UI Sections / Khu vực UI

Upload panel, media grid/table, filter/search, preview/detail panel, metadata form, visibility action.

## Components / Thành phần

Upload Panel, Media Grid, Media Preview, Metadata Form, Filter Bar, Confirmation Dialog.

## Form / Form

Upload metadata và media metadata update như altText, purpose, ownerType, visibility.

## Validation / Validation

File type, size, purpose, owner reference, altText nếu public/SEO.

## Search / Tìm kiếm

Search theo fileName, altText, owner reference nếu có quyền.

## Filter / Lọc

Purpose, ownerType, visibility, mediaStatus, createdAt.

## Sort / Sắp xếp

Default `createdAt` desc.

## Pagination / Phân trang

Default 20, max 100.

## Upload / Upload

Upload prepare/complete là chức năng chính, hiển thị job/progress contract nếu có.

## Download / Download

Download URL theo visibility; signed URL có expiresAt.

## Loading State / Trạng thái tải

Skeleton grid/table; upload state riêng từng file.

## Empty State / Trạng thái rỗng

Chưa có media hoặc không có kết quả theo filter.

## Error State / Trạng thái lỗi

Invalid file type, file too large, scan failed, permission denied.

## Success State / Trạng thái thành công

Upload complete, metadata saved, visibility updated.

## Confirmation Dialog / Hộp xác nhận

Archive/delete media và đổi visibility private/public.

## Toast Message / Toast

Upload thành công/lỗi, cập nhật metadata, tạo download URL.

## Skeleton / Skeleton

Media thumbnail skeleton và detail panel skeleton.

## Responsive Behavior / Hành vi responsive

Desktop grid/table; mobile dùng grid compact và detail full-screen.

## Accessibility / Khả năng tiếp cận

Upload control có label, preview có alt text, file status có text.

## SEO Metadata / SEO metadata

Noindex vì admin/private; altText quản lý để phục vụ SEO public.

