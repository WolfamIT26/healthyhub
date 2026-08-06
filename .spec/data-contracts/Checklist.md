# Data Contract Checklist / Checklist Data Contract

## Purpose / Mục tiêu

Checklist này dùng để kiểm tra bộ Data Contract Specification trước khi chuyển sang API Specification.

## Coverage Checklist / Checklist phạm vi

| Item / Hạng mục | Status / Trạng thái |
| --- | --- |
| Request Model | Done |
| Response Model | Done |
| DTO Convention | Done |
| Pagination Contract | Done |
| Filter Contract | Done |
| Search Contract | Done |
| Sort Contract | Done |
| Upload Contract | Done |
| Download Contract | Done |
| Import Contract | Done |
| Export Contract | Done |
| Error Response | Done |
| Success Response | Done |
| Warning Response | Done |
| Validation Response | Done |
| AI Response | Done |
| Metadata | Done |
| Enum Contract | Done |
| Contract Versioning | Done |
| Domain Contract Map | Done |

## Data Standard Checklist / Checklist chuẩn dữ liệu

| Item / Hạng mục | Status / Trạng thái |
| --- | --- |
| DateTime Format | Done |
| Timezone | Done |
| Number Format | Done |
| Currency Format | Done |
| Decimal Precision | Done |
| Boolean Convention | Done |
| Null Convention | Done |
| Empty Collection Convention | Done |
| File URL Convention | Done |
| Image URL Convention | Done |

## Safety Checklist / Checklist an toàn

| Item / Hạng mục | Status / Trạng thái |
| --- | --- |
| Không lộ password hash | Done |
| Không lộ token raw ngoài auth contract chuyên trách | Done |
| Không lộ provider secret | Done |
| Không lộ SQL hoặc stack trace trong error | Done |
| Có masking rule cho dữ liệu cá nhân | Done |
| Có AI safety và human review rule | Done |
| Có file upload security rule | Done |
| Có versioning và deprecation rule | Done |

## Non-Code Checklist / Checklist không tạo code

| Item / Hạng mục | Status / Trạng thái |
| --- | --- |
| Không tạo API endpoint | Done |
| Không viết DTO TypeScript | Done |
| Không tạo entity hoặc ORM model | Done |
| Không viết SQL | Done |
| Không tạo migration | Done |
| Không tạo nghiệp vụ mới ngoài blueprint/spec/domain/database hiện có | Done |

