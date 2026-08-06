# Staff Database / Database domain nhân sự

## Storage Purpose / Mục đích lưu trữ

Lưu hồ sơ nhân sự vận hành, phạm vi công việc, quyền vận hành và hoạt động để phục vụ xử lý đơn, kho, khách hàng và audit.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `staff_profiles` | Hồ sơ nhân sự gắn với user account. |
| `staff_assignments` | Phân công vai trò/phạm vi vận hành. |
| `operational_permissions` | Quyền vận hành chi tiết theo nghiệp vụ. |
| `staff_activities` | Lịch sử thao tác quan trọng của staff. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `staff_profiles` | `id` | `tenant_id`, `staff_code`, `staff_status`, `work_scope`, `assigned_role` | `user_account_id` -> User | active, suspended, left |
| `staff_assignments` | `id` | `tenant_id`, `assignment_scope`, `assigned_at`, `expires_at`, `assignment_status` | `staff_profile_id`, `assigned_by` -> User | active, expired, revoked |
| `operational_permissions` | `id` | `tenant_id`, `permission_area`, `permission_level`, `permission_status` | `staff_profile_id` | active, inactive |
| `staff_activities` | `id` | `tenant_id`, `activity_type`, `target_domain`, `target_reference_id`, `activity_note`, `activity_at` | `staff_profile_id` | recorded |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Một `staff_profile` gắn với một `user_account`.
- 1-N: Một staff có nhiều assignment, permission và activity.
- N-N: Staff và operational scope có thể mở rộng bằng assignment nếu cần nhiều phạm vi.
- Cardinality: Staff không tồn tại nếu không có user account nội bộ.

## Business Constraints / Ràng buộc nghiệp vụ

- Staff chỉ thao tác trong scope được cấp.
- Hành động xử lý order, inventory, customer cần đủ dấu vết audit.
- Staff bị suspended/left không được thao tác vận hành.

## Delete Strategy / Chiến lược xóa

- Staff dùng suspended/left hoặc soft delete, không hard delete nếu có activity.
- Assignment và activity giữ lịch sử, không hard delete trong audit window.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Activity cần `activity_at`, `target_domain`, `target_reference_id` để truy vết liên domain.

## Data Lifecycle / Vòng đời dữ liệu

Staff được tạo khi có user nội bộ, được phân công, cập nhật quyền, tạm khóa hoặc kết thúc làm việc nhưng lịch sử hoạt động vẫn giữ.

## Data Ownership / Sở hữu dữ liệu

Staff domain sở hữu hồ sơ và audit vận hành của staff. User domain sở hữu quyền đăng nhập và role gốc.

## Data Validation / Validation dữ liệu

- `staff_code` unique theo tenant.
- `expires_at` sau `assigned_at` nếu có.
- `target_domain` phải thuộc danh sách domain được phép audit.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `staff_code` | `staff_profiles` | Mã nhân sự nội bộ. | Unique theo tenant. |
| `work_scope` | `staff_profiles` | Phạm vi công việc. | Theo enum OperationalScope. |
| `permission_area` | `operational_permissions` | Khu vực nghiệp vụ được thao tác. | Order, Inventory, Customer, Product. |
| `target_reference_id` | `staff_activities` | ID logic của dữ liệu bị tác động. | Bắt buộc với activity nghiệp vụ. |
| `activity_note` | `staff_activities` | Ghi chú thao tác. | Bắt buộc với hành động nhạy cảm. |
