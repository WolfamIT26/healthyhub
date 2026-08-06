# Filter Search Sort Contract / Chuẩn lọc, tìm kiếm, sắp xếp

## Purpose / Mục tiêu

Tài liệu này chuẩn hóa cách mô tả filter, search và sort để API Design sau này có cùng quy tắc, tránh query tùy tiện và bảo vệ hiệu năng database.

## Query Principle / Nguyên tắc truy vấn

- Chỉ cho phép filter, search và sort trên field được whitelist trong API spec sau này.
- Không cho client gửi tên cột database trực tiếp.
- Không cho phép operator tùy ý ngoài danh sách được phê duyệt.
- Mọi query public cần tránh làm lộ dữ liệu bị ẩn, draft, deleted hoặc ngoài tenant scope.

## Filter Contract / Chuẩn filter

| Component / Thành phần | Meaning / Ý nghĩa | Rule / Quy tắc |
| --- | --- | --- |
| `field` | Field contract được phép lọc | Dùng camelCase, không dùng tên cột database. |
| `operator` | Cách so sánh | Chỉ dùng operator được phê duyệt. |
| `value` | Giá trị lọc | Phải đúng kiểu dữ liệu contract. |
| `values` | Nhiều giá trị | Dùng cho operator nhiều giá trị. |
| `from` / `to` | Khoảng giá trị | Dùng cho ngày, số, tiền. |

## Allowed Filter Operators / Operator lọc được phép

| Operator / Toán tử | Meaning / Ý nghĩa | Usage / Cách dùng |
| --- | --- | --- |
| `eq` | Bằng | Status, type, ID, code. |
| `neq` | Khác | Dùng hạn chế, tránh query kém hiệu năng. |
| `in` | Thuộc danh sách | Status, category, brand, role. |
| `not_in` | Không thuộc danh sách | Dùng hạn chế. |
| `gt` | Lớn hơn | Giá, số lượng, ngày. |
| `gte` | Lớn hơn hoặc bằng | Giá, số lượng, ngày. |
| `lt` | Nhỏ hơn | Giá, số lượng, ngày. |
| `lte` | Nhỏ hơn hoặc bằng | Giá, số lượng, ngày. |
| `between` | Trong khoảng | Ngày, giá, metric. |
| `contains` | Chứa chuỗi | Chỉ dùng với field text được phép. |
| `is_null` | Là null | Chỉ dùng cho field nullable được phép. |
| `is_not_null` | Không null | Chỉ dùng cho field nullable được phép. |

## Search Contract / Chuẩn tìm kiếm

| Field / Trường | Meaning / Ý nghĩa | Rule / Quy tắc |
| --- | --- | --- |
| `q` | Từ khóa tìm kiếm | Trim, giới hạn độ dài, không rỗng nếu search được bật. |
| `fields` | Field muốn search | Chỉ chọn trong danh sách được phép. |
| `mode` | Chế độ search | Keyword, phrase, fuzzy hoặc semantic nếu feature hỗ trợ. |
| `language` | Ngôn ngữ search | Mặc định tiếng Việt. |

## Search Usage / Cách dùng search

| Domain / Domain | Search Fields / Field tìm kiếm đề xuất | Note / Ghi chú |
| --- | --- | --- |
| Product | Product name, code, slug, summary, ingredient keywords | Có thể dùng full text index và AI Search sau này. |
| Category | Name, slug | Dùng cho catalog navigation. |
| Brand | Name, slug | Dùng cho filter sản phẩm. |
| Order | Order code, customer summary, recipient phone masked | Admin only, cần masking. |
| Customer | Name, email masked, phone masked | Staff/admin only. |
| Blog | Title, slug, summary, content keywords | Hỗ trợ SEO. |
| AI | Interaction summary, capability, source domain | Admin/audit only. |

## Sort Contract / Chuẩn sắp xếp

| Field / Trường | Meaning / Ý nghĩa | Rule / Quy tắc |
| --- | --- | --- |
| `field` | Field contract được sắp xếp | Chỉ dùng field whitelist. |
| `direction` | Chiều sắp xếp | Chỉ dùng `asc` hoặc `desc`. |
| `priority` | Thứ tự sort nhiều field | Optional, dùng khi có nhiều sort. |

## Default Sort / Sắp xếp mặc định

| Resource / Tài nguyên | Default Sort / Sắp xếp mặc định |
| --- | --- |
| Product public | Featured trước, sau đó mới cập nhật hoặc bán chạy nếu có dữ liệu. |
| Product admin | `updatedAt` giảm dần. |
| Order | `createdAt` giảm dần. |
| Customer | `createdAt` giảm dần. |
| Inventory | Cảnh báo tồn kho trước, sau đó `updatedAt` giảm dần. |
| Review | `createdAt` giảm dần. |
| Blog | `publishedAt` giảm dần. |
| Audit/log | `createdAt` giảm dần. |

## Security & Performance / Bảo mật và hiệu năng

- Reject filter field không có trong whitelist.
- Reject sort field không có index nếu list lớn và không có lý do rõ.
- Không cho phép filter trực tiếp trên field nhạy cảm chưa masking.
- Search public không được trả sản phẩm draft, archived, deleted hoặc ngoài visibility.
- AI semantic search phải tôn trọng quyền truy cập như search thường.

