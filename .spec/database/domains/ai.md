# AI Database / Database domain AI

## Storage Purpose / Mục đích lưu trữ

Lưu interaction AI, context đã dùng, nguồn tri thức, review output và safety flag để kiểm soát AI layer toàn hệ thống.

## Entity List / Danh sách Entity

| Logical Entity | Purpose / Vai trò |
| --- | --- |
| `ai_interactions` | Một lần tương tác AI theo capability. |
| `prompt_contexts` | Context metadata được đưa vào AI. |
| `ai_output_reviews` | Review output AI bởi người hoặc rule. |
| `ai_knowledge_sources` | Nguồn tri thức nội bộ được phép dùng. |
| `ai_safety_flags` | Cảnh báo an toàn/rủi ro AI. |

## Logical Entity Design / Thiết kế entity logic

| Entity | PK | Main Attributes / Thuộc tính chính | FK / Tham chiếu | Data Status |
| --- | --- | --- | --- | --- |
| `ai_interactions` | `id` | `tenant_id`, `ai_capability_type`, `interaction_status`, `prompt_version`, `output_confidence`, `fallback_reason`, `requested_at` | `customer_profile_id` -> Customer nullable, `user_account_id` -> User nullable | requested, generated, rejected, escalated, failed |
| `prompt_contexts` | `id` | `tenant_id`, `context_scope`, `source_domain`, `source_reference_id`, `context_policy`, `context_status` | `ai_interaction_id`, `ai_knowledge_source_id` nullable | selected, used, rejected |
| `ai_output_reviews` | `id` | `tenant_id`, `review_status`, `review_reason`, `reviewed_at` | `ai_interaction_id`, `reviewed_by` -> User nullable | pending, approved, rejected |
| `ai_knowledge_sources` | `id` | `tenant_id`, `source_name`, `source_type`, `source_reference`, `source_status`, `last_reviewed_at` | None | active, stale, disabled |
| `ai_safety_flags` | `id` | `tenant_id`, `safety_level`, `flag_reason`, `flag_status`, `flagged_at` | `ai_interaction_id` | open, reviewed, dismissed, escalated |

## Relationship & Cardinality / Quan hệ và số lượng

- 1-1: Một AI interaction có thể có một review chính ở workflow nhạy cảm.
- 1-N: Một interaction có nhiều prompt context và safety flag.
- N-N: AI interaction có thể dùng nhiều knowledge source qua `prompt_contexts`.
- Cardinality: Interaction có thể từ guest, customer hoặc staff/admin tùy capability.

## Business Constraints / Ràng buộc nghiệp vụ

- AI chỉ hỗ trợ, không tự quyết định thay staff/admin ở luồng rủi ro.
- AI không dùng dữ liệu nhạy cảm nếu chưa có policy.
- Nutrition AI không chẩn đoán hoặc chỉ định y tế.
- Output có confidence thấp cần fallback hoặc escalation.

## Delete Strategy / Chiến lược xóa

- AI interaction dùng retention và có thể anonymize dữ liệu cá nhân.
- Safety flag/review không hard delete trong audit window.
- Knowledge source dùng stale/disabled thay vì xóa nếu đã dùng trong prompt context.

## Audit Fields / Trường audit

Áp dụng audit fields chuẩn. Cần ghi `requested_at`, `reviewed_at`, `flagged_at` và `prompt_version`.

## Data Lifecycle / Vòng đời dữ liệu

Interaction được request, chọn context, tạo output, review hoặc safety flag nếu cần, sau đó approved/rejected/escalated/archived theo retention.

## Data Ownership / Sở hữu dữ liệu

AI domain sở hữu interaction metadata, prompt context và review. Product/Customer/Order/Media/Blog/Analytics sở hữu dữ liệu nguồn.

## Data Validation / Validation dữ liệu

- `source_domain` phải thuộc domain được phép theo context policy.
- `output_confidence` phải có thang đo rõ.
- `source_reference` không chứa secret hoặc dữ liệu nhạy cảm không được phép.

## Data Dictionary / Từ điển dữ liệu

| Field | Entity | Meaning / Ý nghĩa | Validation |
| --- | --- | --- | --- |
| `ai_capability_type` | `ai_interactions` | Nhóm năng lực AI. | chat, recommendation, search, compare, ocr, vision, nutrition, marketing, analytics. |
| `prompt_version` | `ai_interactions` | Phiên bản prompt dùng. | Bắt buộc để audit output. |
| `context_scope` | `prompt_contexts` | Phạm vi context. | public, customer_allowed, staff_allowed, internal. |
| `output_confidence` | `ai_interactions` | Độ tin cậy output. | Có threshold fallback. |
| `safety_level` | `ai_safety_flags` | Mức rủi ro. | low, medium, high, blocked. |
