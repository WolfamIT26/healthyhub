# AI Physical Database / Database vật lý domain AI

## Table List / Danh sách bảng

| Table | Description / Mô tả |
| --- | --- |
| `ai_interactions` | Lượt tương tác AI. |
| `prompt_contexts` | Context metadata đã dùng. |
| `ai_output_reviews` | Review output AI. |
| `ai_knowledge_sources` | Nguồn tri thức nội bộ. |
| `ai_safety_flags` | Cờ an toàn/rủi ro AI. |

## Common Audit Columns / Cột audit chung

Mọi bảng dùng `id BIGINT UNSIGNED NOT NULL`, `tenant_id BIGINT UNSIGNED NOT NULL`, `created_at DATETIME(3) NOT NULL`, `updated_at DATETIME(3) NOT NULL`, `deleted_at DATETIME(3) NULL`, `created_by BIGINT UNSIGNED NULL`, `updated_by BIGINT UNSIGNED NULL`, `deleted_by BIGINT UNSIGNED NULL`, `version INT UNSIGNED NOT NULL DEFAULT 1`.

## Column List / Danh sách cột

| Table | Column | MySQL Type | Nullable | Default | Key/Note |
| --- | --- | --- | --- | --- | --- |
| `ai_interactions` | `customer_profile_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK Customer optional. |
| `ai_interactions` | `user_account_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK User optional. |
| `ai_interactions` | `ai_capability_type` | `VARCHAR(64)` | No | None | chat/recommendation/search/compare/ocr/vision/nutrition/marketing/analytics. |
| `ai_interactions` | `interaction_status` | `VARCHAR(32)` | No | `requested` | requested/generated/rejected/escalated/failed. |
| `ai_interactions` | `prompt_version` | `VARCHAR(64)` | No | None | Prompt version. |
| `ai_interactions` | `output_confidence` | `DECIMAL(5,4)` | No | `0.0000` | 0-1. |
| `ai_interactions` | `fallback_reason` | `VARCHAR(500)` | Yes | `NULL` | Required when fallback. |
| `ai_interactions` | `requested_at` | `DATETIME(3)` | No | Current time | Time. |
| `prompt_contexts` | `ai_interaction_id` | `BIGINT UNSIGNED` | No | None | FK AI. |
| `prompt_contexts` | `ai_knowledge_source_id` | `BIGINT UNSIGNED` | Yes | `NULL` | FK knowledge source optional. |
| `prompt_contexts` | `context_scope` | `VARCHAR(64)` | No | None | public/internal/customer_allowed. |
| `prompt_contexts` | `source_domain` | `VARCHAR(64)` | No | None | Domain source. |
| `prompt_contexts` | `source_reference_id` | `BIGINT UNSIGNED` | Yes | `NULL` | Reference ID. |
| `prompt_contexts` | `context_policy` | `JSON` | No | None | Rule payload. |
| `prompt_contexts` | `context_status` | `VARCHAR(32)` | No | `selected` | selected/used/rejected. |
| `ai_output_reviews` | `ai_interaction_id` | `BIGINT UNSIGNED` | No | None | FK AI. |
| `ai_output_reviews` | `review_status` | `VARCHAR(32)` | No | `pending` | pending/approved/rejected. |
| `ai_output_reviews` | `review_reason` | `VARCHAR(500)` | Yes | `NULL` | Required when rejected. |
| `ai_output_reviews` | `reviewed_at` | `DATETIME(3)` | Yes | `NULL` | Review time. |
| `ai_output_reviews` | `reviewed_by` | `BIGINT UNSIGNED` | Yes | `NULL` | FK User. |
| `ai_knowledge_sources` | `source_name` | `VARCHAR(255)` | No | None | Source name. |
| `ai_knowledge_sources` | `source_type` | `VARCHAR(64)` | No | None | product/blog/policy/faq/manual. |
| `ai_knowledge_sources` | `source_reference` | `VARCHAR(500)` | No | None | Reference path/id. |
| `ai_knowledge_sources` | `source_status` | `VARCHAR(32)` | No | `active` | active/stale/disabled. |
| `ai_knowledge_sources` | `last_reviewed_at` | `DATETIME(3)` | Yes | `NULL` | Review time. |
| `ai_safety_flags` | `ai_interaction_id` | `BIGINT UNSIGNED` | No | None | FK AI. |
| `ai_safety_flags` | `safety_level` | `VARCHAR(32)` | No | `low` | low/medium/high/blocked. |
| `ai_safety_flags` | `flag_reason` | `VARCHAR(500)` | No | None | Reason. |
| `ai_safety_flags` | `flag_status` | `VARCHAR(32)` | No | `open` | open/reviewed/dismissed/escalated. |
| `ai_safety_flags` | `flagged_at` | `DATETIME(3)` | No | Current time | Time. |

## Keys & Constraints / Khóa và ràng buộc

| Table | PK | FK | Unique Constraint | Check Constraint | Index |
| --- | --- | --- | --- | --- | --- |
| `ai_interactions` | `id` | `customer_profile_id`, `user_account_id` | None | confidence between 0 and 1 | `idx_ai_interactions_tenant_capability_status_time`, `idx_ai_interactions_source_ref` |
| `prompt_contexts` | `id` | `ai_interaction_id`, `ai_knowledge_source_id` | None | source_reference_id > 0 if present | `idx_prompt_contexts_interaction_scope`, `idx_prompt_contexts_source_domain` |
| `ai_output_reviews` | `id` | `ai_interaction_id`, `reviewed_by` | One review per interaction by migration rule | status allowed | `idx_ai_output_reviews_status_time` |
| `ai_knowledge_sources` | `id` | None | `(tenant_id, source_name, source_type)` | source_status allowed | `idx_ai_knowledge_sources_status_type` |
| `ai_safety_flags` | `id` | `ai_interaction_id` | None | safety_level allowed | `idx_ai_safety_flags_interaction_level`, `idx_ai_safety_flags_status_time` |

## Full Text & Generated Columns / Full text và generated column

- Full Text Index: Không dùng trên AI metadata.
- Generated Column: Không dùng ở MVP.

## FK Delete Rule / Quy tắc xóa FK

- AI interactions/reviews/flags: Restrict trong retention window; archive/anonymize thay vì hard delete.
- Knowledge source: Restrict nếu còn referenced context.
- User/Customer FK: Set Null nếu xóa mềm/hard delete theo policy.

## Performance & Retention / Hiệu năng và lưu giữ

- AI interactions là ứng viên partition/archive theo `requested_at`.
- `source_reference` và `context_scope` cần index vì truy vấn review/debug.
