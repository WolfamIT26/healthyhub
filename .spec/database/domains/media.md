# Media Database / Database domain media

## Storage Purpose / Mục đích lưu trữ

Lưu metadata ảnh, banner, chứng nhận và file upload; kiểm soát mục đích sử dụng, quyền xem và liên kết với domain khác.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `media_assets` | File media logic như ảnh sản phẩm, banner, chứng nhận. |
| `media_usages` | Ghi nhận media được dùng ở đâu. |
| `media_access_policies` | Quyền xem/tải media. |
| `media_metadata` | Metadata phụ trợ như alt text, size, OCR state future. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `media_assets` | `id` | `tenant_id`, `media_name`, `media_type`, `media_purpose`, `storage_reference`, `media_visibility`, `media_status` | None | uploaded, active, hidden, archived, failed |
| `media_usages` | `id` | `tenant_id`, `usage_domain`, `usage_reference_id`, `usage_role`, `usage_status` | `media_asset_id` | active, inactive |
| `media_access_policies` | `id` | `tenant_id`, `access_scope`, `allow_public`, `policy_status` | `media_asset_id` | active, inactive |
| `media_metadata` | `id` | `tenant_id`, `alt_text`, `caption`, `certificate_reference`, `metadata_status` | `media_asset_id` | active, stale |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Một media asset có thể có một metadata chính.
- 1-N: Một media asset có nhiều usage và access policy theo context.
- N-N: Product/Brand/Blog và Media qua link entity ở domain nguồn hoặc `media_usages`.
- Cardinality: Media public phải có policy cho phép public.

## Business Constraints / Ràng buộc nghiệp vụ

- Ảnh sản phẩm phải đúng sản phẩm và không gây hiểu nhầm.
- File chứng nhận hoặc tài liệu nhạy cảm cần kiểm soát quyền xem.
- AI/OCR/Vision chỉ được dùng media theo policy.

## Delete Strategy / Chiến lược xóa

- Media dùng hidden/archive nếu đang được tham chiếu.
- File temporary có thể hard delete theo retention riêng.
- Metadata có thể cập nhật version khi OCR/Vision chạy lại.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Media cần thêm `uploaded_by`, `reviewed_by` nếu có kiểm duyệt.

## Data Lifecycle / Vòng đời dữ liệu

Media upload, kiểm tra, active/public hoặc restricted, được liên kết domain, sau đó hidden/archive khi không dùng.

## Data Ownership / Sở hữu dữ liệu

Media domain sở hữu file metadata và access policy. Product/Brand/Blog sở hữu ý nghĩa liên kết nghiệp vụ.

## Data Validation / Validation dữ liệu

- `storage_reference` bắt buộc nhưng không chứa secret.
- `media_type` thuộc enum cho phép.
- Public media cần `alt_text` khi dùng cho web/SEO.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `storage_reference` | `media_assets` | Tham chiếu file trong storage. | Không lưu credential. |
| `media_type` | `media_assets` | Loại file. | image, document, banner, certificate. |
| `media_purpose` | `media_assets` | Mục đích dùng. | product, brand, blog, ai_upload, temporary. |
| `allow_public` | `media_access_policies` | Có cho xem public không. | Boolean logic, cần policy. |
| `alt_text` | `media_metadata` | Mô tả ảnh. | Bắt buộc cho media public quan trọng. |
