# Category Domain / Domain danh mục

## Purpose / Mục đích

Tổ chức sản phẩm thành nhóm dễ hiểu để khách tìm và duyệt sản phẩm.

## Responsibility / Trách nhiệm

- Quản lý danh mục sản phẩm.
- Đảm bảo danh mục public rõ nghĩa và không trùng lặp.
- Hỗ trợ Product trong phân loại và điều hướng.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `Category`
- Entity: `CategoryDisplayRule`
- Value Object: `CategoryName`, `CategorySlug`, `CategoryDescription`
- Enum: `CategoryStatus`, `CategoryVisibility`

## Relationships / Quan hệ với domain khác

- Product phải tham chiếu Category khi public.
- AI Search và Analytics dùng Category để hiểu nhóm sản phẩm.

## Business Rule / Quy tắc nghiệp vụ

- Category public phải có tên dễ hiểu.
- Không tạo category trùng nghĩa gây rối.
- Category bị ẩn không xuất hiện trong điều hướng public.

## Domain Event / Sự kiện domain

- `CategoryCreated`
- `CategoryRenamed`
- `CategoryHidden`

## Dependency / Phụ thuộc

- Core dependency: Product
- Supporting dependency: AI, Analytics

## Boundary / Ranh giới

Category không quản lý nội dung chi tiết sản phẩm hoặc tồn kho; chỉ sở hữu phân loại.

