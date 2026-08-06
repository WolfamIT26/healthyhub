# File Transfer Contract / Chuẩn upload, download, import, export

## Purpose / Mục tiêu

Tài liệu này chuẩn hóa contract cho upload, download, import và export file. Phạm vi áp dụng gồm product images, documents, AI uploaded files, certificates, reports và temporary files.

## File Principle / Nguyên tắc file

- Contract không trả local path hoặc storage path nội bộ cho public client.
- File private phải dùng signed URL có hạn hoặc cơ chế truy cập đã kiểm quyền.
- Upload phải có purpose rõ để áp dụng validation, retention và security scan.
- Import/export phải có job status để xử lý bất đồng bộ khi file lớn.

## Upload Contract / Chuẩn upload

| Field / Trường | Meaning / Ý nghĩa | Rule / Quy tắc |
| --- | --- | --- |
| `fileName` | Tên file gốc | Cần sanitize, không dùng làm storage key trực tiếp. |
| `contentType` | MIME type | Phải nằm trong danh sách cho phép theo purpose. |
| `sizeBytes` | Kích thước file | Không vượt quá giới hạn theo purpose. |
| `checksum` | Dấu kiểm file | Khuyến nghị để phát hiện lỗi truyền tải. |
| `purpose` | Mục đích upload | Product image, certificate, AI input, import data, document. |
| `ownerType` | Loại resource sở hữu | Product, brand, blog, user, order, AI interaction hoặc system. |
| `ownerId` | ID resource sở hữu | Nullable nếu upload trước rồi gắn sau. |
| `visibility` | Quyền hiển thị | Public, private, internal hoặc temporary. |
| `expiresAt` | Hết hạn file tạm | Bắt buộc với temporary upload. |

## Upload Purpose Rule / Quy tắc mục đích upload

| Purpose / Mục đích | Allowed File / File được phép | Note / Ghi chú |
| --- | --- | --- |
| Product image | Image | Cần optimize và tạo thumbnail sau này. |
| Brand logo | Image | Ưu tiên kích thước nhỏ, nền phù hợp UI. |
| Certificate | Image hoặc PDF | Có thể private hoặc public tùy sản phẩm. |
| Blog media | Image | Cần alt text cho SEO. |
| AI input | Image, PDF hoặc text file được phê duyệt | Cần scan và giới hạn retention. |
| Import data | CSV/XLSX nếu được hỗ trợ sau này | Cần dry-run và row-level validation. |
| Report export | CSV/XLSX/PDF nếu được hỗ trợ sau này | Cần quyền và audit. |

## Download Contract / Chuẩn download

| Field / Trường | Meaning / Ý nghĩa | Rule / Quy tắc |
| --- | --- | --- |
| `fileUrl` | URL tải file | Public URL hoặc signed URL tùy visibility. |
| `fileName` | Tên file hiển thị | Không chứa ký tự nguy hiểm. |
| `contentType` | MIME type | Dùng để client xử lý đúng. |
| `sizeBytes` | Kích thước file | Giúp client cảnh báo trước khi tải. |
| `expiresAt` | Hết hạn URL | Bắt buộc với signed URL. |
| `downloadPolicy` | Chính sách tải | Public, authenticated, role_required hoặc signed. |

## Import Contract / Chuẩn import

| Field / Trường | Meaning / Ý nghĩa | Rule / Quy tắc |
| --- | --- | --- |
| `importId` | ID job import | Dùng để theo dõi tiến trình. |
| `status` | Trạng thái import | Pending, validating, processing, completed, failed, cancelled. |
| `sourceFile` | Metadata file nguồn | Không trả storage key public. |
| `totalRows` | Tổng số dòng | Có sau bước đọc file. |
| `successRows` | Dòng hợp lệ đã xử lý | Có thể cập nhật theo tiến trình. |
| `failedRows` | Dòng lỗi | Có danh sách lỗi giới hạn. |
| `dryRun` | Chạy thử | Dùng để kiểm tra trước khi ghi dữ liệu. |
| `startedAt` / `finishedAt` | Thời gian xử lý | Dùng UTC ISO 8601. |

## Import Error Rule / Quy tắc lỗi import

- Lỗi import phải có row number, field, error code và message.
- Không trả toàn bộ nội dung file nếu chứa dữ liệu nhạy cảm.
- Số lỗi trả về trong response phải có giới hạn.
- File lỗi chi tiết nếu có phải là file private hoặc signed URL.

## Export Contract / Chuẩn export

| Field / Trường | Meaning / Ý nghĩa | Rule / Quy tắc |
| --- | --- | --- |
| `exportId` | ID job export | Dùng để theo dõi tiến trình. |
| `status` | Trạng thái export | Pending, processing, completed, failed, expired, cancelled. |
| `format` | Định dạng file | CSV, XLSX hoặc PDF nếu feature hỗ trợ sau này. |
| `fileUrl` | URL tải file | Signed URL nếu dữ liệu private. |
| `expiresAt` | Thời điểm hết hạn | Bắt buộc với export private. |
| `filterSummary` | Tóm tắt dữ liệu xuất | Giúp audit và người dùng hiểu phạm vi export. |
| `requestedBy` | Người yêu cầu | Dạng summary, không trả dữ liệu nhạy cảm. |

## Security Rule / Quy tắc bảo mật file

- Upload cần kiểm tra extension, MIME type, magic bytes và kích thước.
- File phải được scan malware nếu môi trường production có khả năng.
- Không cho upload executable hoặc script.
- File temporary phải có retention ngắn.
- AI uploaded files phải có policy xóa hoặc ẩn danh rõ.

