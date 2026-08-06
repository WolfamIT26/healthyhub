# Brand Domain / Domain thương hiệu

## Purpose / Mục đích

Quản lý thương hiệu, nhà sản xuất hoặc nguồn gốc thương mại của sản phẩm.

## Responsibility / Trách nhiệm

- Quản lý tên, mô tả và trạng thái brand.
- Gắn brand với sản phẩm.
- Quản lý thông tin chứng nhận hoặc nguồn gốc ở mức nghiệp vụ.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `Brand`
- Entity: `BrandCertificate`, `BrandMediaLink`
- Value Object: `BrandName`, `BrandOrigin`, `CertificateInfo`
- Enum: `BrandStatus`, `CertificateStatus`

## Relationships / Quan hệ với domain khác

- Product tham chiếu Brand.
- Media lưu hình ảnh/chứng nhận liên quan brand.
- AI Search/Compare có thể dùng Brand để giải thích sản phẩm.

## Business Rule / Quy tắc nghiệp vụ

- Brand phải có tên rõ ràng.
- Brand không được gây hiểu nhầm nguồn gốc.
- Chứng nhận liên quan brand cần kiểm soát media và trạng thái.

## Domain Event / Sự kiện domain

- `BrandCreated`
- `BrandUpdated`
- `BrandCertificateAdded`
- `BrandHidden`

## Dependency / Phụ thuộc

- Core dependency: Product, Media
- Supporting dependency: AI

## Boundary / Ranh giới

Brand không quản lý supplier contract hoặc kho hàng. Domain này chỉ quản lý thông tin thương hiệu cho catalog.

