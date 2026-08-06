# Metadata Contract / Chuẩn metadata

## Purpose / Mục tiêu

Metadata Contract chuẩn hóa các field kỹ thuật và ngữ cảnh đi kèm request/response để hỗ trợ logging, audit, monitoring, pagination, localization, security và AI traceability.

## Metadata Principle / Nguyên tắc metadata

- Metadata không chứa dữ liệu nghiệp vụ chính.
- Metadata không chứa secret, token raw hoặc thông tin nhạy cảm không cần thiết.
- Metadata phải giúp trace request mà không cần lộ chi tiết nội bộ.
- Metadata có thể mở rộng additive mà không phá contract cũ.

## Common Metadata Fields / Field metadata dùng chung

| Field / Trường | Direction / Hướng | Meaning / Ý nghĩa |
| --- | --- | --- |
| `requestId` | Request/Response | ID request để client và backend đối chiếu. |
| `traceId` | Request/Response | ID trace qua gateway, backend, database, AI và integration. |
| `correlationId` | Optional | ID liên kết nhiều request trong cùng workflow. |
| `contractVersion` | Request/Response | Phiên bản contract. |
| `servedAt` | Response | Thời điểm backend tạo response theo UTC. |
| `locale` | Request/Response | Ngôn ngữ mong muốn hoặc ngôn ngữ đã áp dụng. |
| `timezone` | Request/Response | Timezone client hoặc timezone đã dùng để tính toán. |
| `clientSource` | Request | Web, mobile, admin, integration hoặc AI. |
| `tenantId` | Request/Response có kiểm soát | Tenant/store scope khi áp dụng SaaS sau này. |
| `dataScope` | Response | Public, own, staff_scope, admin_scope hoặc tenant_scope. |

## Audit Metadata / Metadata audit

| Field / Trường | Meaning / Ý nghĩa | Exposure / Mức lộ |
| --- | --- | --- |
| `createdAt` | Thời điểm tạo resource | Public nếu hữu ích. |
| `updatedAt` | Thời điểm cập nhật resource | Public nếu hữu ích. |
| `deletedAt` | Thời điểm xóa mềm | Admin only. |
| `createdBy` | Người tạo | Admin/audit summary. |
| `updatedBy` | Người sửa | Admin/audit summary. |
| `version` | Version optimistic locking | Chỉ trả khi update cần chống ghi đè. |

## Pagination Metadata / Metadata phân trang

Pagination metadata phải theo [Pagination Contract](pagination-contract.md) và nằm trong metadata của response list.

Field chính:

- `page`.
- `pageSize`.
- `totalItems`.
- `totalPages`.
- `hasNext`.
- `hasPrevious`.
- `nextCursor` nếu dùng cursor.

## Query Metadata / Metadata truy vấn

| Field / Trường | Meaning / Ý nghĩa |
| --- | --- |
| `appliedFilter` | Filter đã được backend áp dụng sau khi normalize. |
| `appliedSearch` | Search query đã được sanitize và áp dụng. |
| `appliedSort` | Sort cuối cùng, gồm default sort nếu client không gửi. |
| `resultLimited` | Cho biết kết quả bị giới hạn vì hiệu năng hoặc quyền. |
| `includePolicy` | Include nào đã được chấp nhận hoặc từ chối. |

## Cache Metadata / Metadata cache

| Field / Trường | Meaning / Ý nghĩa |
| --- | --- |
| `cacheStatus` | hit, miss, bypass hoặc revalidated. |
| `cacheKeyPolicy` | Không trả key thật nếu nhạy cảm, chỉ mô tả policy. |
| `expiresAt` | Thời điểm cache hoặc signed URL hết hạn nếu có. |
| `staleAllowed` | Cho biết dữ liệu stale có được dùng tạm hay không. |

## AI Metadata / Metadata AI

| Field / Trường | Meaning / Ý nghĩa |
| --- | --- |
| `interactionId` | ID tương tác AI. |
| `capability` | Năng lực AI được gọi. |
| `modelAlias` | Alias nội bộ hoặc nhóm model, không cần lộ provider chi tiết nếu chưa quyết định. |
| `inputScope` | Phạm vi dữ liệu AI được phép dùng. |
| `sourcePolicy` | Cách xử lý nguồn: public, masked, summarized hoặc hidden. |
| `humanReview` | Có cần người duyệt hay không. |

## Security Metadata / Metadata bảo mật

- Không trả role permission chi tiết nếu không cần.
- Có thể trả `permissionScope` dạng summary cho admin UI.
- Rate limit metadata chỉ trả thông tin cần để client xử lý retry.
- Deprecation metadata có thể thông báo contract sắp hết hạn mà không làm gián đoạn client.

