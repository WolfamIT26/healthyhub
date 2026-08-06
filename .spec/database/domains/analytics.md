# Analytics Database / Database domain phân tích

## Storage Purpose / Mục đích lưu trữ

Lưu báo cáo, snapshot chỉ số, insight và dashboard view để hỗ trợ phân tích doanh số, khách hàng, tồn kho, promotion và AI.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `analytics_reports` | Báo cáo phân tích theo kỳ/phạm vi. |
| `metric_snapshots` | Snapshot chỉ số đã tính. |
| `insight_records` | Insight hoặc cảnh báo phân tích. |
| `dashboard_views` | Cấu hình view dashboard theo user/role. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `analytics_reports` | `id` | `tenant_id`, `report_scope`, `reporting_period`, `report_status`, `generated_at` | `generated_by` -> User nullable | draft, generated, reviewed, archived |
| `metric_snapshots` | `id` | `tenant_id`, `metric_type`, `metric_value`, `period_start`, `period_end`, `source_domain` | `analytics_report_id` | calculated, stale, archived |
| `insight_records` | `id` | `tenant_id`, `insight_type`, `insight_confidence`, `insight_status`, `source_reference`, `created_at` | `analytics_report_id`, `ai_interaction_id` -> AI nullable | created, reviewed, dismissed, actioned |
| `dashboard_views` | `id` | `tenant_id`, `view_name`, `view_scope`, `layout_reference`, `view_status` | `owner_user_id` -> User nullable | active, inactive |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Không có 1-1 bắt buộc.
- 1-N: Một report có nhiều metric snapshot và insight.
- N-N: Dashboard view có thể tổng hợp nhiều metric type theo cấu hình logic.
- Cardinality: Metric snapshot phải thuộc một reporting period rõ ràng.

## Business Constraints / Ràng buộc nghiệp vụ

- Analytics chỉ đọc/tổng hợp, không sửa dữ liệu vận hành.
- Dữ liệu cá nhân phải giảm thiểu hoặc ẩn danh khi phù hợp.
- AI insight chỉ là đề xuất, manager quyết định.

## Delete Strategy / Chiến lược xóa

- Report/snapshot/insight dùng archive theo retention, không hard delete ngay nếu dùng cho audit kinh doanh.
- Dashboard view có thể inactive hoặc deleted mềm.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Report cần `generated_at`; insight cần `reviewed_by`, `reviewed_at` nếu có review.

## Data Lifecycle / Vòng đời dữ liệu

Report được tạo theo kỳ, metric calculated, insight created/reviewed/actioned hoặc dismissed, report archived theo retention.

## Data Ownership / Sở hữu dữ liệu

Analytics domain sở hữu snapshot và insight đã tổng hợp. Domain nguồn vẫn sở hữu dữ liệu vận hành.

## Data Validation / Validation dữ liệu

- `period_end` sau `period_start`.
- `metric_value` phải có đơn vị hoặc meaning rõ.
- `source_domain` phải thuộc danh sách domain được phép.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `report_scope` | `analytics_reports` | Phạm vi báo cáo. | sales, customer, inventory, marketing, ai. |
| `metric_type` | `metric_snapshots` | Loại chỉ số. | revenue, order_count, stock_risk, conversion. |
| `metric_value` | `metric_snapshots` | Giá trị chỉ số. | Có meaning/period rõ. |
| `insight_confidence` | `insight_records` | Độ tin cậy insight. | low, medium, high hoặc score logic. |
| `layout_reference` | `dashboard_views` | Cấu hình layout dashboard. | Không chứa dữ liệu nhạy cảm. |
