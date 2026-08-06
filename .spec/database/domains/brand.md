# Brand Database / Database domain thương hiệu

## Storage Purpose / Mục đích lưu trữ

Lưu thương hiệu, nguồn gốc, chứng nhận và liên kết media để hỗ trợ catalog, độ tin cậy sản phẩm và lọc/tìm kiếm.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `brands` | Thương hiệu hoặc nhà sản xuất. |
| `brand_certificates` | Chứng nhận/giấy tờ liên quan brand. |
| `brand_media_links` | Liên kết brand với media như logo/certificate image. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `brands` | `id` | `tenant_id`, `brand_name`, `brand_slug`, `brand_origin`, `brand_status`, `description` | None | active, hidden, archived |
| `brand_certificates` | `id` | `tenant_id`, `certificate_name`, `certificate_info`, `issued_at`, `expires_at`, `certificate_status` | `brand_id` | valid, expired, revoked, pending |
| `brand_media_links` | `id` | `tenant_id`, `media_role`, `display_order`, `link_status` | `brand_id`, `media_asset_id` -> Media | active, inactive |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Một brand có thể có một logo chính qua media role.
- 1-N: Một brand có nhiều product và certificate.
- N-N: Brand và Media qua `brand_media_links`.
- Cardinality: Product có thể nullable brand trong giai đoạn nhập liệu, nhưng product public nên có brand nếu nghiệp vụ yêu cầu nguồn gốc.

## Business Constraints / Ràng buộc nghiệp vụ

- Brand phải có tên rõ ràng trước khi gắn product.
- Không hiển thị certificate hết hạn như còn hiệu lực.
- Nguồn gốc brand không được gây hiểu nhầm.

## Delete Strategy / Chiến lược xóa

- Brand dùng hidden/archive nếu đang gắn product.
- Certificate dùng status expired/revoked thay vì hard delete nếu đã public.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Certificate cần `issued_at`, `expires_at` và `verified_by` nếu sau này có quy trình kiểm duyệt.

## Data Lifecycle / Vòng đời dữ liệu

Brand tạo, active, gắn product/media/certificate, có thể hidden hoặc archived khi không dùng.

## Data Ownership / Sở hữu dữ liệu

Brand domain sở hữu brand và certificate metadata. Media domain sở hữu file gốc.

## Data Validation / Validation dữ liệu

- `brand_name` không rỗng và không trùng rõ trong tenant.
- `brand_slug` unique theo tenant.
- `expires_at` sau `issued_at` nếu có.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `brand_name` | `brands` | Tên thương hiệu. | Bắt buộc, không gây hiểu nhầm. |
| `brand_origin` | `brands` | Nguồn gốc/xuất xứ. | Có thể nullable, cần đúng nguồn. |
| `certificate_name` | `brand_certificates` | Tên chứng nhận. | Bắt buộc khi public. |
| `certificate_status` | `brand_certificates` | Trạng thái chứng nhận. | valid, expired, revoked, pending. |
| `media_role` | `brand_media_links` | Vai trò media. | logo, certificate, banner. |
