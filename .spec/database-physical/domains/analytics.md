# Analytics Physical Database / Database vật lý domain phân tích

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `analytics_reports` | Báo cáo phân tích theo kỳ. |
| `metric_snapshots` | Snapshot chỉ số. |
| `insight_records` | Insight/cảnh báo phân tích. |
| `dashboard_views` | Cấu hình dashboard view. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `analytics_reports` | `report_scope` | `VARCHAR(32)` | No | None | sales/customer/inventory/marketing/ai. |
| `analytics_reports` | `reporting_period` | `VARCHAR(64)` | No | None | e.g. 2026-08. |
| `analytics_reports` | `report_status` | `VARCHAR(32)` | No | `draft` | draft/generated/reviewed/archived. |
| `analytics_reports` | `generated_at` | `DATETIME(3)` | Yes | `NULL` | Generate time. |
| `analytics_reports` | `generated_by` | `BIGINT UNSIGNED` | Yes | `NULL` | FK User. |
| `metric_snapshots` | `analytics_report_id` | `BIGINT UNSIGNED` | No | None | FK Report. |
| `metric_snapshots` | `metric_type` | `VARCHAR(64)` | No | None | revenue/order_count/stock_risk/etc. |
| `metric_snapshots` | `metric_value` | `DECIMAL(18,4)` | No | `0.0000` | Value. |
| `metric_snapshots` | `period_start` | `DATETIME(3)` | No | None | Start. |
| `metric_snapshots` | `period_end` | `DATETIME(3)` | No | None | End. |
| `metric_snapshots` | `source_domain` | `VARCHAR(64)` | No | None | Domain name. |
| `metric_snapshots` | `metric_unit` | `VARCHAR(32)` | Yes | `NULL` | Currency/count/percent. |
| `insight_records` | `analytics_report_id` | `BIGINT UNSIGNED` | No | None | FK Report. |
| `insight_records` | `ai_interaction_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK AI interaction optional. |
| `insight_records` | `insight_type` | `VARCHAR(64)` | No | None | trend/anomaly/recommendation. |
| `insight_records` | `insight_confidence` | `DECIMAL(5,4)` | No | `0.0000` | 0-1 score. |
| `insight_records` | `insight_status` | `VARCHAR(32)` | No | `created` | created/reviewed/dismissed/actioned. |
| `insight_records` | `source_reference` | `JSON` | Yes | `NULL` | Reference metadata. |
| `dashboard_views` | `owner_user_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK User. |
| `dashboard_views` | `view_name` | `VARCHAR(150)` | No | None | Name. |
| `dashboard_views` | `view_scope` | `VARCHAR(64)` | No | `tenant` | tenant/platform/role. |
| `dashboard_views` | `layout_reference` | `JSON` | No | None | Layout config. |
| `dashboard_views` | `view_status` | `VARCHAR(32)` | No | `active` | active/inactive. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `analytics_reports` | `id` | `generated_by` | `(tenant_id, report_scope, reporting_period)` | `report_status` allowed | `idx_analytics_reports_scope_period_status`, `idx_analytics_reports_generated_at` |
| `metric_snapshots` | `id` | `analytics_report_id` | `(tenant_id, analytics_report_id, metric_type, period_start, period_end, source_domain)` | period_end after period_start | `idx_metric_snapshots_report_metric`, `idx_metric_snapshots_source_period` |
| `insight_records` | `id` | `analytics_report_id`, `ai_interaction_id` | None | confidence between 0 and 1 | `idx_insight_records_report_status`, `idx_insight_records_type_confidence` |
| `dashboard_views` | `id` | `owner_user_id` | `(tenant_id, owner_user_id, view_name)` | `view_scope/status` allowed | `idx_dashboard_views_owner_status` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: `source_reference` không dùng full text; query theo period/report/scope.
- Generated Column: Có thể tạo bucket ngày/tháng cho metric report sau này nếu cần.

## FK Delete Rule / Quy tắc xóa FK

- Reports/snapshots/insights: Restrict hoặc archive, không hard delete trước retention.
- `generated_by`/`owner_user_id`: Set Null khi user xóa mềm/hard delete.

## Performance & Retention / Hiệu năng và lưu giữ

- Metric snapshot và insight là ứng viên partition/archive theo `period_start`.
- Analytics query phải đọc snapshot, không scan bảng giao dịch nguồn.
