# Media Domain / Domain media

## Purpose / Mục đích

Quản lý tài nguyên hình ảnh, banner, chứng nhận và file dùng trong HealthyHub.

## Responsibility / Trách nhiệm

- Phân loại media theo mục đích.
- Kiểm soát quyền xem media nhạy cảm.
- Liên kết media với Product, Brand, Blog hoặc AI OCR/Vision.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `MediaAsset`
- Entity: `MediaUsage`, `MediaAccessPolicy`, `MediaMetadata`
- Value Object: `MediaName`, `MediaPurpose`, `AltText`, `CertificateReference`
- Enum: `MediaStatus`, `MediaType`, `MediaVisibility`

## Relationships / Quan hệ với domain khác

- Product, Brand và Blog dùng Media.
- AI OCR/Vision xử lý Media khi được phép.
- Settings có thể cấu hình media policy.

## Business Rule / Quy tắc nghiệp vụ

- Media public phải đúng mục đích và không gây hiểu nhầm.
- Chứng nhận/tài liệu nhạy cảm cần kiểm soát quyền.
- Media không dùng nữa cần trạng thái ẩn hoặc lưu trữ.

## Domain Event / Sự kiện domain

- `MediaAssetAdded`
- `MediaLinked`
- `MediaHidden`
- `MediaAccessPolicyChanged`

## Dependency / Phụ thuộc

- Shared by: Product, Brand, Blog, AI
- Supporting dependency: Settings

## Boundary / Ranh giới

Media không xử lý storage implementation. Storage Gateway sẽ được thiết kế ở prompt kỹ thuật sau.

