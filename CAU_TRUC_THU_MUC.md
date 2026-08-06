# CAU_TRUC_THU_MUC / Cấu trúc thư mục dự án

File này là bản tiếng Việt dễ đọc để tra nhanh cấu trúc dự án HealthyHub.

Nếu bạn thấy tên file hoặc thư mục bằng tiếng Anh, xem bảng bên dưới để biết nó dùng làm gì.

## Cay thu muc co chu thich / Cây thư mục có chú thích

```text
healthyhub/                              # Thư mục gốc của dự án HealthyHub
├── .spec/                               # Đặc tả tính năng, Domain, Database và Data Contract để AI sinh code sau này
│   ├── README.md                        # Quy tắc dùng hệ thống specification
│   ├── _template/                       # Template bắt buộc cho mỗi tính năng
│   │   ├── Overview.md                  # Tổng quan tính năng
│   │   ├── Requirement.md               # Yêu cầu tính năng
│   │   ├── Business-Flow.md             # Luồng nghiệp vụ
│   │   ├── Database.md                  # Ảnh hưởng database
│   │   ├── API.md                       # API của tính năng
│   │   ├── UI.md                        # Giao diện của tính năng
│   │   ├── Validation.md                # Quy tắc validation
│   │   ├── Security.md                  # Yêu cầu bảo mật
│   │   ├── Testing.md                   # Kế hoạch test
│   │   └── Acceptance-Criteria.md       # Tiêu chí hoàn thành
│   ├── features/                        # Nơi đặt đặc tả từng tính năng thật
│   │   ├── README.md                    # Feature Index, danh sách toàn bộ feature spec
│   │   ├── Status.md                    # Trạng thái bộ feature spec
│   │   ├── Report.md                    # Báo cáo bộ feature spec
│   │   ├── Checklist.md                 # Checklist bộ feature spec
│   │   ├── ChangeLog.md                 # Nhật ký thay đổi feature spec
│   │   └── <feature-name>/README.md     # Đặc tả nghiệp vụ riêng của từng feature
│   ├── domain/                          # Domain Model, mô hình nghiệp vụ toàn hệ thống
│   │   ├── README.md                    # Domain Index, danh sách tài liệu domain
│   │   ├── domain-overview.md           # Tổng quan domain và phân loại domain
│   │   ├── domain-dependency-map.md     # Bản đồ phụ thuộc giữa các domain
│   │   ├── ubiquitous-language.md       # Từ điển thuật ngữ thống nhất
│   │   ├── business-constraints.md      # Ràng buộc nghiệp vụ quan trọng
│   │   ├── Status.md                    # Trạng thái Domain Model
│   │   ├── Report.md                    # Báo cáo Domain Model
│   │   ├── Checklist.md                 # Checklist Domain Model
│   │   ├── ChangeLog.md                 # Nhật ký thay đổi Domain Model
│   │   └── domains/                     # Chi tiết từng domain nghiệp vụ
│   │       ├── README.md                # Danh sách file domain
│   │       └── <domain-name>.md         # Mô hình riêng của từng domain
│   ├── database/                        # Logical Database Design, thiết kế database mức logic
│   │   ├── README.md                    # Database Index, danh sách tài liệu database
│   │   ├── database-standards.md        # Chuẩn đặt tên, ID, timestamp, enum, lookup
│   │   ├── domain-data-map.md           # Bản đồ dữ liệu theo domain sở hữu
│   │   ├── cross-domain-relationships.md # Quan hệ dữ liệu giữa các domain
│   │   ├── logical-erd.md               # ERD logic dạng mô tả, chưa phải SQL
│   │   ├── data-readiness.md            # Chuẩn bị multi-tenant, audit, AI, analytics, versioning
│   │   ├── Status.md                    # Trạng thái Logical Database Design
│   │   ├── Report.md                    # Báo cáo Logical Database Design
│   │   ├── Checklist.md                 # Checklist Logical Database Design
│   │   ├── ChangeLog.md                 # Nhật ký thay đổi Logical Database Design
│   │   └── domains/                     # Database logic riêng cho từng domain
│   │       ├── README.md                # Danh sách database file theo domain
│   │       └── <domain-name>.md         # Entity, PK, FK, quan hệ, data dictionary của domain
│   ├── database-physical/               # Physical Database Design, thiết kế database mức vật lý
│   │   ├── README.md                    # Physical Database Index, danh sách tài liệu physical database
│   │   ├── physical-standards.md        # Chuẩn MySQL, kiểu dữ liệu, audit, JSON, UUID
│   │   ├── relationship-rules.md        # Quy tắc FK, cascade, restrict, set null
│   │   ├── index-catalog.md             # Danh mục index, composite index, full text index
│   │   ├── performance-strategy.md      # Chiến lược index, partition, archive, retention
│   │   ├── migration-strategy.md        # Quy tắc versioning, rollback, seed, environment
│   │   ├── backup-recovery.md           # Chiến lược backup, restore, disaster recovery
│   │   ├── Status.md                    # Trạng thái Physical Database Design
│   │   ├── Report.md                    # Báo cáo Physical Database Design
│   │   ├── Checklist.md                 # Checklist Physical Database Design
│   │   ├── ChangeLog.md                 # Nhật ký thay đổi Physical Database Design
│   │   └── domains/                     # Database vật lý riêng cho từng domain
│   │       ├── README.md                # Danh sách database vật lý theo domain
│   │       └── <domain-name>.md         # Table, column, type, index, constraint của domain
│   ├── data-contracts/                  # Data Contract Specification, chuẩn dữ liệu chung trước khi thiết kế API
│   │   ├── README.md                    # Contract Index, mục lục chuẩn dữ liệu
│   │   ├── contract-standards.md        # Quy tắc đặt tên, DTO convention, privacy, compatibility
│   │   ├── data-format-standards.md     # Chuẩn thời gian, số, tiền, boolean, null, URL
│   │   ├── request-model.md             # Chuẩn request model, metadata request, payload rule
│   │   ├── response-model.md            # Chuẩn response model, list, detail, action output
│   │   ├── api-envelope.md              # Khung success, warning, error, metadata, trace ID, request ID
│   │   ├── pagination-contract.md       # Chuẩn phân trang page và cursor
│   │   ├── filter-search-sort-contract.md # Chuẩn lọc, tìm kiếm và sắp xếp
│   │   ├── file-transfer-contract.md    # Chuẩn upload, download, import và export file
│   │   ├── error-standard.md            # Chuẩn mã lỗi, nhóm lỗi, object lỗi
│   │   ├── validation-response.md       # Chuẩn lỗi validation theo field, collection, cross-field
│   │   ├── ai-response.md               # Chuẩn phản hồi AI, confidence, source, safety
│   │   ├── metadata-contract.md         # Chuẩn metadata kỹ thuật, audit, pagination, AI
│   │   ├── enum-contract.md             # Chuẩn enum và catalog enum theo domain
│   │   ├── versioning.md                # Quy tắc versioning, backward compatibility, deprecation
│   │   ├── domain-contract-map.md       # Mapping contract theo từng domain nghiệp vụ
│   │   ├── Status.md                    # Trạng thái Data Contract Specification
│   │   ├── Report.md                    # Báo cáo Data Contract Specification
│   │   ├── Checklist.md                 # Checklist Data Contract Specification
│   │   └── ChangeLog.md                 # Nhật ký thay đổi Data Contract Specification
│   ├── api/                             # API Specification, đặc tả endpoint trước khi sinh OpenAPI/code
│   │   ├── README.md                    # API Index, mục lục đặc tả API
│   │   ├── api-conventions.md           # Quy ước REST, URI, method, status code, versioning
│   │   ├── security.md                  # JWT, refresh token, role, permission, API key, CORS, rate limit
│   │   ├── authentication-flow.md       # Luồng đăng nhập, refresh, logout, verify email, reset password
│   │   ├── error-catalog.md             # Danh mục mã lỗi API theo domain
│   │   ├── domain-api-map.md            # Mapping domain sang namespace, permission, contract
│   │   ├── endpoint-matrix.md           # Ma trận endpoint chính để tra nhanh
│   │   ├── rate-limit-policy.md         # Chính sách giới hạn gọi API theo nhóm endpoint
│   │   ├── webhook-policy.md            # Chính sách webhook payment, shipping, notification, integration
│   │   ├── Status.md                    # Trạng thái API Specification
│   │   ├── Report.md                    # Báo cáo API Specification
│   │   ├── Checklist.md                 # Checklist API Specification
│   │   ├── ChangeLog.md                 # Nhật ký thay đổi API Specification
│   │   └── domains/                     # Đặc tả API riêng cho từng domain
│   │       ├── README.md                # Danh sách API domain
│   │       └── <domain-name>.md         # Endpoint, quyền, request/response/error, rule của domain
│   └── ui-contract/                     # UI Contract Specification, hợp đồng màn hình trước khi thiết kế frontend
│       ├── README.md                    # UI Contract Index, mục lục hợp đồng UI
│       ├── ui-contract-standards.md     # Chuẩn route, dữ liệu, form, list, AI UI
│       ├── navigation.md                # Điều hướng Public, Customer, Staff, Admin
│       ├── screen-flow.md               # Luồng chuyển giữa các màn hình
│       ├── component-mapping.md         # Mapping màn hình với nhóm component logic
│       ├── state-contract.md            # Chuẩn loading, empty, error, success, toast, skeleton
│       ├── Status.md                    # Trạng thái UI Contract Specification
│       ├── Report.md                    # Báo cáo UI Contract Specification
│       ├── Checklist.md                 # Checklist UI Contract Specification
│       ├── ChangeLog.md                 # Nhật ký thay đổi UI Contract Specification
│       └── screens/                     # UI Contract riêng cho từng màn hình
│           ├── README.md                # Danh sách màn hình
│           └── <screen-name>.md         # Route, quyền, API, data, state, responsive, accessibility
├── .github/                             # Cấu hình GitHub workflow, issue, pull request
│   ├── ISSUE_TEMPLATE/                  # Mẫu tạo issue trên GitHub
│   │   ├── bug_report.md                # Mẫu báo lỗi
│   │   └── feature_request.md           # Mẫu đề xuất tính năng
│   ├── workflows/                       # GitHub Actions CI/CD
│   │   ├── ci.yml                       # Workflow kiểm tra cấu trúc framework
│   │   ├── test.yml                     # Workflow kiểm tra tài liệu/test placeholder
│   │   └── deploy.yml                   # Workflow deploy placeholder, chưa deploy thật
│   └── PULL_REQUEST_TEMPLATE.md         # Mẫu pull request trên GitHub
├── .ai/                                 # Hệ thống dành cho AI Agent làm việc
│   ├── agents/                          # Khung AI Agent theo vai trò
│   │   ├── README.md                    # Danh sách agent
│   │   ├── architect-agent.md           # Agent kiến trúc
│   │   ├── backend-agent.md             # Agent backend
│   │   ├── frontend-agent.md            # Agent frontend
│   │   ├── database-agent.md            # Agent database
│   │   ├── reviewer-agent.md            # Agent review
│   │   ├── qa-agent.md                  # Agent kiểm thử
│   │   ├── documentation-agent.md       # Agent tài liệu
│   │   └── security-agent.md            # Agent bảo mật
│   ├── checklists/                      # Checklist vận hành cho AI workflow
│   │   ├── README.md                    # Danh sách checklist AI
│   │   ├── generate-checklist.md        # Checklist sinh mới
│   │   ├── review-checklist.md          # Checklist review
│   │   ├── refactor-checklist.md        # Checklist refactor
│   │   ├── audit-checklist.md           # Checklist audit
│   │   ├── testing-checklist.md         # Checklist kiểm thử
│   │   ├── documentation-checklist.md   # Checklist tài liệu
│   │   └── release-checklist.md         # Checklist release
│   ├── context/                         # Ngữ cảnh dự án cho AI đọc trước khi làm
│   │   ├── README.md                    # Hướng dẫn thứ tự đọc context
│   │   ├── project-context.md           # Thông tin tổng quan dự án
│   │   ├── healthyhub-domain.md         # Ngữ cảnh nghiệp vụ bán sản phẩm healthy
│   │   ├── technology-stack.md          # Công nghệ dùng trong dự án
│   │   ├── architecture-context.md      # Ngữ cảnh kiến trúc Modular Monolith
│   │   ├── gateway-context.md           # Ngữ cảnh các gateway tích hợp ngoài
│   │   ├── ai-capability-map.md         # Bản đồ các nhóm tính năng AI
│   │   ├── development-workflow-context.md # Ngữ cảnh quy trình phát triển
│   │   └── context-management.md        # Quy tắc quản lý ngữ cảnh cho AI
│   ├── context-packs/                   # Gói ngữ cảnh theo module để tối ưu token
│   │   ├── README.md                    # Giới thiệu context pack
│   │   ├── module-context-pack-template.md # Mẫu context pack cho module
│   │   ├── core/                        # Context pack cho nhiệm vụ AI Core
│   │   └── modules/                     # Context pack từng module nghiệp vụ
│   ├── examples/                        # Ví dụ cho AI học cách làm đúng/sai
│   │   ├── good-examples/               # Ví dụ tốt
│   │   ├── bad-examples/                # Ví dụ xấu cần tránh
│   │   └── best-practices/              # Thực hành tốt
│   ├── knowledge/                       # Tri thức framework dành cho AI Agent
│   │   ├── README.md                    # Giới thiệu AI Knowledge Framework
│   │   ├── framework-knowledge-map.md   # Bản đồ tri thức framework
│   │   ├── architecture-knowledge.md    # Tri thức kiến trúc
│   │   ├── documentation-knowledge.md   # Tri thức tài liệu
│   │   ├── security-knowledge.md        # Tri thức bảo mật
│   │   └── ai-workflow-knowledge.md     # Tri thức workflow AI
│   ├── memory/                          # Ghi nhớ AI qua thời gian
│   │   ├── decision-history.md          # Lịch sử quyết định
│   │   ├── lessons-learned.md           # Bài học đã học
│   │   ├── architecture-history.md      # Lịch sử kiến trúc
│   │   ├── ai-memory.md                 # Ghi nhớ quan trọng cho AI
│   │   ├── prompt-history.md            # Lịch sử prompt quan trọng
│   │   ├── module-history.md            # Lịch sử module
│   │   └── change-history.md            # Lịch sử thay đổi AI Core
│   ├── personas/                        # Persona theo vai trò AI Agent
│   │   ├── architect.md                 # AI kiến trúc sư
│   │   ├── backend.md                   # AI backend
│   │   ├── frontend.md                  # AI frontend
│   │   ├── database.md                  # AI database
│   │   ├── ui-ux.md                     # AI UI/UX
│   │   ├── tester.md                    # AI tester
│   │   ├── reviewer.md                  # AI reviewer
│   │   ├── security.md                  # AI security
│   │   ├── devops.md                    # AI DevOps
│   │   ├── marketing.md                 # AI marketing
│   │   ├── system-designer.md           # Persona thiết kế hệ thống
│   │   ├── api-designer.md              # Persona thiết kế API
│   │   ├── ai-engineer.md               # Persona AI Engineer
│   │   ├── qa-engineer.md               # Persona QA
│   │   ├── code-reviewer.md             # Persona review code
│   │   ├── technical-writer.md          # Persona viết kỹ thuật
│   │   ├── prompt-engineer.md           # Persona prompt engineer
│   │   └── documentation-writer.md      # Persona writer tài liệu
│   ├── prompts/                         # Mẫu prompt tiếng Việt cho AI Agent
│   │   ├── README.md                    # Giới thiệu hệ thống prompt
│   │   ├── 00-master-agent-prompt.md    # Prompt tổng cho AI Agent
│   │   ├── 01-project-initialization-prompt.md # Prompt khởi tạo dự án
│   │   ├── 02-module-initialization-prompt.md  # Prompt khởi tạo module
│   │   ├── 03-requirement-analysis-prompt.md   # Prompt phân tích yêu cầu
│   │   ├── 04-architecture-design-prompt.md    # Prompt thiết kế kiến trúc
│   │   ├── 05-database-design-prompt.md # Prompt thiết kế database
│   │   ├── 06-api-design-prompt.md      # Prompt thiết kế API
│   │   ├── 07-frontend-design-prompt.md # Prompt thiết kế frontend
│   │   ├── 08-backend-development-prompt.md # Prompt chuẩn bị backend
│   │   ├── 09-ai-feature-prompt.md      # Prompt thiết kế tính năng AI
│   │   ├── 10-testing-prompt.md         # Prompt thiết kế kiểm thử
│   │   ├── 11-review-prompt.md          # Prompt review code/tài liệu
│   │   ├── 12-documentation-update-prompt.md # Prompt cập nhật tài liệu
│   │   ├── 13-release-prompt.md         # Prompt chuẩn bị release
│   │   ├── 14-prompt-standard.md        # Chuẩn viết prompt
│   │   └── framework/                   # Prompt framework, không phải nghiệp vụ
│   ├── registry/                        # Sổ đăng ký skill, prompt, template, context, agent, rule
│   │   ├── README.md                    # Giới thiệu AI Registry
│   │   ├── skills-registry.md           # Đăng ký skill
│   │   ├── prompts-registry.md          # Đăng ký prompt
│   │   ├── templates-registry.md        # Đăng ký template
│   │   ├── context-packs-registry.md    # Đăng ký context pack
│   │   ├── agents-registry.md           # Đăng ký agent
│   │   └── rules-registry.md            # Đăng ký rule
│   ├── reviewers/                       # Reviewer chuyên trách cho AI
│   │   ├── README.md                    # Danh sách reviewer
│   │   ├── architecture-reviewer.md     # Reviewer kiến trúc
│   │   ├── security-reviewer.md         # Reviewer bảo mật
│   │   ├── documentation-reviewer.md    # Reviewer tài liệu
│   │   ├── prompt-reviewer.md           # Reviewer prompt
│   │   └── ai-reviewer.md               # Reviewer AI
│   ├── rules/                           # Quy tắc bắt buộc cho AI Agent
│   │   ├── README.md                    # Danh sách rule
│   │   ├── 00-agent-mandatory-rules.md  # Luật bắt buộc trước/sau khi làm
│   │   ├── 01-language-and-naming-rules.md # Quy tắc ngôn ngữ và đặt tên
│   │   ├── 02-project-architecture-rules.md # Quy tắc kiến trúc dự án
│   │   ├── 03-documentation-rules.md    # Quy tắc cập nhật tài liệu
│   │   ├── 04-security-rules.md         # Quy tắc bảo mật
│   │   ├── 05-ai-layer-rules.md         # Quy tắc AI Layer
│   │   ├── 06-gateway-rules.md          # Quy tắc Gateway
│   │   ├── 07-testing-rules.md          # Quy tắc kiểm thử
│   │   ├── 08-ai-workflow-rules.md      # Quy tắc workflow AI
│   │   ├── 09-token-optimization-rules.md # Quy tắc tối ưu token
│   │   ├── 10-folder-rules.md           # Quy tắc thư mục
│   │   ├── 11-markdown-rules.md         # Quy tắc Markdown
│   │   ├── 12-coding-rules.md           # Quy tắc code
│   │   ├── 13-api-rules.md              # Quy tắc API
│   │   ├── 14-database-rules.md         # Quy tắc database
│   │   ├── 15-git-rules.md              # Quy tắc Git
│   │   ├── 16-performance-rules.md      # Quy tắc hiệu năng
│   │   └── 17-prompt-rules.md           # Quy tắc prompt
│   ├── skills/                          # Kỹ năng làm việc theo vai trò cho AI
│   │   ├── README.md                    # Giới thiệu AI Skill System
│   │   ├── 00-ai-agent-operating-system.md # Quy trình làm việc tổng
│   │   ├── 01-requirement-analysis-skill.md # Kỹ năng phân tích yêu cầu
│   │   ├── 02-architecture-design-skill.md # Kỹ năng thiết kế kiến trúc
│   │   ├── 03-database-design-skill.md  # Kỹ năng thiết kế database
│   │   ├── 04-api-design-skill.md       # Kỹ năng thiết kế API
│   │   ├── 05-frontend-design-skill.md  # Kỹ năng thiết kế frontend
│   │   ├── 06-backend-design-skill.md   # Kỹ năng thiết kế backend
│   │   ├── 07-ai-feature-design-skill.md # Kỹ năng thiết kế AI feature
│   │   ├── 08-testing-review-skill.md   # Kỹ năng kiểm thử và review
│   │   ├── 09-documentation-update-skill.md # Kỹ năng cập nhật tài liệu
│   │   ├── 10-release-management-skill.md # Kỹ năng quản lý release
│   │   └── roles/                       # Skill theo vai trò AI
│   ├── templates/                       # Template cho module, checklist, report
│       ├── README.md                    # Giới thiệu hệ thống template
│       ├── module/                      # Mẫu tài liệu bắt buộc cho mỗi module
│       │   ├── README.md                # Tổng quan module
│       │   ├── Requirement.md           # Yêu cầu module
│       │   ├── Database.md              # Database của module
│       │   ├── API.md                   # API của module
│       │   ├── Frontend.md              # Frontend của module
│       │   ├── Backend.md               # Backend của module
│       │   ├── Testing.md               # Kiểm thử module
│       │   ├── Checklist.md             # Checklist module
│       │   ├── Prompt.md                # Prompt riêng cho module
│       │   ├── Status.md                # Trạng thái module
│       │   ├── Report.md                # Báo cáo module
│       │   ├── ChangeLog.md             # Nhật ký thay đổi module
│       │   ├── Decision.md              # Quyết định kỹ thuật module
│       │   └── TODO.md                  # Việc cần làm của module
│       ├── workflow/                    # Template theo quy trình phát triển
│       ├── checklists/                  # Checklist phát triển, bảo mật, AI, release
│       │   ├── README.md                # Giới thiệu checklist system
│       │   ├── development-checklist.md # Checklist phát triển
│       │   ├── security-checklist.md    # Checklist bảo mật
│       │   ├── ai-feature-checklist.md  # Checklist tính năng AI
│       │   ├── ai-review-checklist.md   # Checklist review AI
│       │   └── release-checklist.md     # Checklist release
│       ├── reports/                     # Template report, status, decision, changelog
│       └── framework/                   # Template mở rộng AI Development Core
│   ├── validators/                      # Bộ tiêu chí kiểm tra output AI
│   │   ├── README.md                    # Danh sách validator
│   │   ├── folder-validator.md          # Kiểm tra thư mục
│   │   ├── markdown-validator.md        # Kiểm tra Markdown
│   │   ├── naming-validator.md          # Kiểm tra đặt tên
│   │   ├── prompt-validator.md          # Kiểm tra prompt
│   │   ├── documentation-validator.md   # Kiểm tra tài liệu
│   │   └── rule-validator.md            # Kiểm tra rule
│   └── workflows/                       # Workflow chuẩn cho AI Agent
│       ├── README.md                    # Danh sách workflow
│       ├── generate-workflow.md         # Quy trình sinh mới
│       ├── review-workflow.md           # Quy trình review
│       ├── refactor-workflow.md         # Quy trình refactor
│       ├── audit-workflow.md            # Quy trình audit
│       ├── testing-workflow.md          # Quy trình kiểm thử
│       ├── documentation-workflow.md    # Quy trình tài liệu
│       └── release-workflow.md          # Quy trình release
├── analytics/                           # Tài liệu đo lường và phân tích dữ liệu
│   ├── README.md                        # Giới thiệu analytics
│   ├── ga4.md                           # Chuẩn bị Google Analytics 4
│   ├── search-console.md                # Chuẩn bị Google Search Console
│   ├── event-tracking.md                # Quy tắc tracking sự kiện
│   ├── conversion-tracking.md           # Tracking chuyển đổi
│   └── dashboard.md                     # Dashboard phân tích
├── api-collections/                     # API collections cho công cụ test API
│   ├── README.md                        # Mapping Postman/Bruno/Insomnia
│   ├── postman/                         # Collection Postman
│   ├── bruno/                           # Collection Bruno
│   └── insomnia/                        # Collection Insomnia
├── apps/                                # Nơi chứa ứng dụng chính
│   ├── api/                             # Backend API
│   │   ├── README.md                    # Giới thiệu backend API
│   │   ├── Dockerfile                   # Build image Docker cho API
│   │   ├── package.json                 # Script/dependency riêng của API
│   │   ├── nest-cli.json                # Cấu hình NestJS CLI
│   │   ├── tsconfig.json                # Cấu hình TypeScript API
│   │   ├── tsconfig.build.json          # Cấu hình build API ra dist
│   │   ├── vitest.config.ts             # Cấu hình test API
│   │   ├── vitest.integration.config.ts # Cấu hình integration test API
│   │   ├── src/                         # Source backend foundation, chưa có nghiệp vụ
│   │   │   ├── main.ts                  # Điểm chạy NestJS API
│   │   │   ├── app.module.ts            # Module gốc của API
│   │   │   ├── ai/                      # Lớp AI trong backend
│   │   │   ├── business/                # Lớp xử lý nghiệp vụ
│   │   │   ├── common/                  # Filter, interceptor, middleware, logger
│   │   │   ├── config/                  # Validate biến môi trường
│   │   │   ├── data/                    # Lớp truy cập database
│   │   │   ├── database/                # TypeORM config, audit entity, transaction, seed
│   │   │   ├── gateways/                # Lớp kết nối provider bên ngoài
│   │   │   │   ├── README.md            # Giải thích Gateway Layer
│   │   │   │   ├── ai/                  # Gateway gọi AI provider
│   │   │   │   ├── analytics/           # Gateway phân tích dữ liệu
│   │   │   │   ├── integration/         # Gateway tích hợp hệ thống ngoài
│   │   │   │   ├── notification/        # Gateway gửi thông báo
│   │   │   │   ├── ocr/                 # Gateway đọc chữ từ ảnh/tài liệu
│   │   │   │   ├── payment/             # Gateway thanh toán
│   │   │   │   ├── storage/             # Gateway lưu trữ file
│   │   │   │   └── vision/              # Gateway nhận diện hình ảnh
│   │   │   └── presentation/            # Lớp controller/route HTTP
│   │   └── tests/                       # Test riêng cho backend
│   ├── mobile/                          # Mobile app chuẩn bị cho tương lai, chưa có code
│   │   ├── README.md                    # Giải thích mobile phát triển sau
│   │   ├── src/                         # Source mobile sau này
│   │   └── tests/                       # Test mobile sau này
│   └── web/                             # Frontend web
│       ├── README.md                    # Giới thiệu web app
│       ├── Dockerfile                   # Build image Docker cho Web
│       ├── index.html                   # HTML entry của Vite
│       ├── package.json                 # Script/dependency riêng của Web
│       ├── postcss.config.cjs           # Cấu hình PostCSS/Tailwind
│       ├── tailwind.config.ts           # Cấu hình Tailwind CSS
│       ├── tsconfig.json                # Cấu hình TypeScript Web
│       ├── vite.config.ts               # Cấu hình Vite
│       ├── public/                      # File public của web
│       ├── src/                         # Source frontend foundation, chưa có nghiệp vụ
│       │   ├── main.tsx                 # Điểm chạy React
│       │   ├── app/                     # Khung app chính
│       │   ├── assets/                  # Ảnh, icon, font
│       │   ├── components/              # Component UI dùng chung
│       │   ├── modules/                 # UI chia theo module nghiệp vụ
│       │   ├── pages/                   # Các trang web
│       │   ├── routes/                  # Route/điều hướng frontend
│       │   ├── services/                # Hàm gọi API/service frontend
│       │   ├── shared/                  # Type/helper dùng chung frontend
│       │   └── styles/                  # CSS/Tailwind/global style
│       └── tests/                       # Test riêng cho frontend
├── audit/                               # Theo dõi hành động người dùng, AI, bảo mật
│   ├── README.md                        # Giới thiệu Audit System
│   ├── user-actions.md                  # Theo dõi hành động người dùng
│   ├── ai-actions.md                    # Theo dõi hành động/đề xuất AI
│   └── security-events.md               # Theo dõi sự kiện bảo mật
├── assets/                              # Kho tài nguyên chung của dự án
│   ├── README.md                        # Giới thiệu assets system
│   ├── logos/                           # Logo thương hiệu
│   ├── icons/                           # Icon dùng chung
│   ├── images/                          # Hình ảnh chung
│   ├── fonts/                           # Font nếu có license phù hợp
│   ├── mockups/                         # Mockup thiết kế/sản phẩm
│   ├── illustrations/                   # Minh họa
│   └── banners/                         # Banner marketing/campaign
├── backup/                              # Hệ thống sao lưu
│   ├── README.md                        # Giới thiệu backup
│   ├── backup-strategy.md               # Chiến lược sao lưu
│   ├── daily-backup.md                  # Sao lưu hằng ngày
│   ├── weekly-backup.md                 # Sao lưu hằng tuần
│   ├── monthly-backup.md                # Sao lưu hằng tháng
│   ├── restore-guideline.md             # Hướng dẫn khôi phục
│   ├── disaster-recovery.md             # Khôi phục thảm họa
│   ├── database/                        # Nơi để backup database
│   ├── files/                           # Nơi để backup file upload
│   └── documents/                       # Nơi để backup tài liệu
├── business/                            # Tài liệu kinh doanh
│   ├── README.md                        # Giới thiệu business documents
│   ├── supplier.md                      # Nhà cung cấp
│   ├── customer.md                      # Khách hàng
│   ├── promotion.md                     # Khuyến mãi
│   ├── voucher.md                       # Voucher
│   ├── pricing.md                       # Định giá
│   ├── revenue.md                       # Doanh thu
│   └── cost.md                          # Chi phí
├── config/                              # Cấu hình dự án
│   ├── README.md                        # Giới thiệu thư mục config
│   ├── docker/                          # Cấu hình Docker bổ sung
│   ├── env/                             # Hướng dẫn biến môi trường
│   │   └── environment-management.md    # Quy tắc tách môi trường và quản lý secret
│   ├── security/                        # Cấu hình bảo mật
│   └── workspace/                       # Cấu hình monorepo/workspace
│       ├── workspace-management.md      # Quy tắc workspace
│       ├── package-manager.md           # Quy tắc npm package manager
│       └── build-workspace.md           # Quy tắc build workspace
├── database/                            # Cơ sở dữ liệu
│   ├── README.md                        # Quy tắc database
│   ├── diagrams/                        # Sơ đồ ERD/database
│   │   ├── README.md                    # Giải thích ERD format
│   │   ├── drawio/                      # File Draw.io
│   │   ├── png/                         # File export PNG
│   │   └── pdf/                         # File export PDF
│   ├── migrations/                      # File migration sau này
│   ├── schemas/                         # Schema khởi tạo database
│   └── seeds/                           # Dữ liệu mẫu cho local
├── deployment/                          # Triển khai
│   ├── README.md                        # Hướng dẫn deployment
│   ├── docker/                          # Dockerfile/cấu hình deploy Docker
│   └── environments/                    # Cấu hình local/staging/production
├── design/                              # Design system cho UI/UX
│   ├── README.md                        # Giới thiệu hệ thống thiết kế
│   ├── components/                      # Tài liệu component UI
│   ├── colors/                          # Bảng màu
│   ├── typography/                      # Font và cấp chữ
│   ├── spacing/                         # Khoảng cách layout
│   ├── icons/                           # Quy tắc icon
│   ├── prototype/                       # UI prototype
│   │   ├── wireframes/                  # Wireframe
│   │   ├── user-flows/                  # User flow
│   │   ├── prototypes/                  # Prototype
│   │   └── ui-mapping/                  # Mapping UI với requirement/API
│   └── screenshots/                     # Ảnh chụp màn hình thiết kế/test
├── docs/                                # Tài liệu chính của dự án
│   ├── README.md                        # Hướng dẫn đọc tài liệu
│   ├── 00-project-rules.md              # Quy tắc dự án
│   ├── 01-folder-structure.md           # Cấu trúc thư mục bản chuẩn
│   ├── 02-architecture.md               # Kiến trúc hệ thống
│   ├── 03-requirement.md                # Chuẩn viết yêu cầu
│   ├── 04-database.md                   # Chuẩn database
│   ├── 05-api.md                        # Chuẩn API
│   ├── 06-ui-ux.md                      # Chuẩn UI/UX
│   ├── 07-frontend.md                   # Chuẩn frontend
│   ├── 08-backend.md                    # Chuẩn backend
│   ├── 09-security.md                   # Chuẩn bảo mật
│   ├── 10-performance.md                # Chuẩn hiệu năng
│   ├── 11-testing.md                    # Chuẩn kiểm thử
│   ├── 12-deployment.md                 # Chuẩn triển khai
│   ├── 13-ai-documentation.md           # Tài liệu AI Layer
│   ├── 14-development-workflow.md       # Quy trình phát triển
│   ├── 15-gateway-architecture.md       # Kiến trúc Gateway
│   ├── 16-monitoring.md                 # Giám sát hệ thống
│   ├── 17-release-management.md         # Quản lý release
│   ├── 18-framework-inventory.md        # Danh sách file đã tạo
│   ├── framework-audit-report.md        # Báo cáo audit framework Version 1.0
│   ├── api/                             # Tài liệu OpenAPI/Swagger
│   │   ├── README.md                    # Mapping API docs
│   │   ├── openapi/                     # Placeholder/tài liệu OpenAPI cũ, file chính nằm ở root openapi/
│   │   │   └── openapi.yaml             # OpenAPI placeholder cũ
│   │   └── swagger/                     # Swagger guideline
│   ├── architecture/                    # Tài liệu kiến trúc chi tiết
│   │   └── adr/                         # Architecture Decision Record
│   │       ├── ADR-001-template.md      # Template ADR chung
│   │       ├── ADR-002-database-decision-template.md # Template quyết định database
│   │       ├── ADR-003-ai-provider-decision-template.md # Template quyết định AI provider
│   │       ├── ADR-004-storage-decision-template.md # Template quyết định storage
│   │       ├── ADR-005-architecture-decision-template.md # Template quyết định architecture
│   │       └── ADR-006-backend-framework-nestjs.md # Quyết định chọn NestJS làm backend framework chính
│   ├── business-blueprint/              # Bản thiết kế nghiệp vụ tổng thể HealthyHub
│   │   ├── README.md                    # Chỉ mục Business Blueprint
│   │   ├── 01-business-strategy.md      # Tầm nhìn, sứ mệnh, mục tiêu, roadmap
│   │   ├── 02-target-users.md           # Nhóm người dùng mục tiêu
│   │   ├── 03-business-domains.md       # Domain nghiệp vụ
│   │   ├── 04-business-rules.md         # Quy tắc nghiệp vụ
│   │   ├── 05-module-map.md             # Bản đồ module
│   │   ├── 06-feature-map.md            # Bản đồ tính năng
│   │   ├── 07-ai-feature-map.md         # Bản đồ tính năng AI
│   │   ├── 08-user-journeys.md          # Hành trình người dùng
│   │   ├── 09-business-flows.md         # Luồng nghiệp vụ
│   │   ├── 10-permission-matrix.md      # Ma trận phân quyền
│   │   ├── 11-acceptance-criteria.md    # Tiêu chí hoàn thành module
│   │   ├── 12-non-functional-requirements.md # Yêu cầu phi chức năng
│   │   ├── 13-version-planning.md       # Kế hoạch phiên bản
│   │   ├── Status.md                    # Trạng thái Business Blueprint
│   │   ├── Report.md                    # Báo cáo Business Blueprint
│   │   ├── Checklist.md                 # Checklist Business Blueprint
│   │   └── ChangeLog.md                 # Nhật ký thay đổi Business Blueprint
│   ├── design-system/                   # Tài liệu Design System, chuẩn giao diện trước khi làm frontend/mobile
│   │   ├── README.md                    # Design System Index, mục lục hệ thống thiết kế
│   │   ├── design-principles.md         # Nguyên tắc thiết kế: tin cậy, mua nhanh, tiếng Việt, AI minh bạch
│   │   ├── design-tokens.md             # Token thiết kế dùng chung cho màu, chữ, spacing, radius, motion
│   │   ├── colors.md                    # Bảng màu HealthyHub và màu trạng thái
│   │   ├── typography.md                # Hệ chữ, kích thước chữ, line-height, quy tắc tiếng Việt
│   │   ├── spacing.md                   # Khoảng cách layout và component
│   │   ├── border-radius.md             # Quy tắc bo góc cho button, input, card, modal
│   │   ├── elevation.md                 # Cấp nổi của card, dropdown, drawer, modal, toast
│   │   ├── shadow.md                    # Quy tắc đổ bóng tương ứng elevation
│   │   ├── grid.md                      # Lưới layout cho storefront, checkout, admin, analytics
│   │   ├── breakpoints.md               # Mốc responsive mobile, tablet, desktop, wide
│   │   ├── icon-guideline.md            # Quy tắc dùng icon
│   │   ├── illustration-guideline.md    # Quy tắc dùng ảnh thật, minh họa, asset
│   │   ├── motion-guideline.md          # Quy tắc chuyển động, loading, skeleton, reduce motion
│   │   ├── dark-mode.md                 # Quy tắc hỗ trợ chế độ tối
│   │   ├── accessibility-guideline.md   # Quy tắc khả năng tiếp cận
│   │   ├── component-library.md         # Tổng quan thư viện component
│   │   ├── component-usage-map.md       # Mapping component với nhóm màn hình
│   │   ├── Status.md                    # Trạng thái Design System
│   │   ├── Report.md                    # Báo cáo Design System
│   │   ├── Checklist.md                 # Checklist Design System
│   │   ├── ChangeLog.md                 # Nhật ký thay đổi Design System
│   │   └── components/                  # Đặc tả chi tiết từng component UI
│   │       ├── README.md                # Danh sách component
│   │       └── <component-name>.md      # Purpose, variant, size, state, accessibility, responsive, usage, do/don't
│   ├── development-standards/           # Chuẩn phát triển để AI/dev sinh code đúng quy tắc
│   │   ├── README.md                    # Development Standards Index, mục lục chuẩn phát triển
│   │   ├── coding-standards.md          # Chuẩn code chung: strict TypeScript, không hardcode, không trùng logic
│   │   ├── typescript-style-guide.md    # Chuẩn TypeScript, type safety, any/unknown, null/undefined
│   │   ├── react-style-guide.md         # Chuẩn React theo feature/module, state, form, API service
│   │   ├── tailwind-style-guide.md      # Chuẩn Tailwind bám Design Token, responsive, state style
│   │   ├── nestjs-style-guide.md        # Chuẩn NestJS Modular Monolith, module/controller/service/repository
│   │   ├── mysql-style-guide.md         # Chuẩn MySQL naming, migration, seed, FK, index, transaction
│   │   ├── api-implementation-standard.md # Chuẩn triển khai API theo API Spec và Data Contract
│   │   ├── data-contract-implementation.md # Chuẩn dùng Data Contract cho DTO/request/response/error/AI
│   │   ├── gateway-standard.md          # Chuẩn Gateway cho AI, payment, storage, notification, OCR, vision, analytics
│   │   ├── folder-convention.md         # Quy ước đặt file đúng thư mục frontend/backend/docs/spec
│   │   ├── naming-convention.md         # Quy ước đặt tên code, database, API, UI, prompt
│   │   ├── import-export-convention.md  # Quy tắc import/export, tránh phụ thuộc vòng và phá module boundary
│   │   ├── error-handling-standard.md   # Chuẩn xử lý lỗi validation/business/system/gateway/AI
│   │   ├── logging-standard.md          # Chuẩn logging application/error/security/audit/AI, không lộ dữ liệu nhạy cảm
│   │   ├── validation-standard.md       # Chuẩn validation frontend, DTO, business, database
│   │   ├── security-standard.md         # Chuẩn bảo mật secret, auth, JWT, RBAC, SQLi, XSS, CSRF, CORS, upload
│   │   ├── performance-standard.md      # Chuẩn hiệu năng pagination, N+1, index, debounce, lazy loading, timeout
│   │   ├── accessibility-standard.md    # Chuẩn accessibility cho storefront, admin, AI
│   │   ├── seo-standard.md              # Chuẩn SEO cho trang public sản phẩm/blog
│   │   ├── testing-standard.md          # Chuẩn unit, integration, API, E2E, security, responsive, accessibility test
│   │   ├── documentation-standard.md    # Chuẩn cập nhật tài liệu sau khi phát triển
│   │   ├── environment-standard.md      # Chuẩn biến môi trường, secret, tách dev/test/prod
│   │   ├── docker-standard.md           # Chuẩn Docker/Docker Compose, MySQL, phpMyAdmin
│   │   ├── git-workflow.md              # Quy trình Git từ đọc spec đến PR
│   │   ├── branching-strategy.md        # Quy tắc đặt tên branch feature/fix/docs/refactor/security/release
│   │   ├── commit-convention.md         # Quy ước commit feat/fix/docs/refactor/test/chore/security/perf/release
│   │   ├── code-review-standard.md      # Checklist review code và mức lỗi Critical/High/Medium/Low
│   │   ├── dependency-management.md     # Quy tắc thêm package, kiểm license/security, không đổi framework tùy tiện
│   │   ├── versioning-release-standard.md # Chuẩn version, release notes, release checklist
│   │   ├── ai-code-generation-rules.md  # Quy tắc AI sinh code: đọc context tối thiểu, không đổi stack/spec
│   │   ├── vertical-slice-workflow.md   # Workflow phát triển module theo lát cắt dọc
│   │   ├── module-done-definition.md    # Definition of Done cho module
│   │   ├── Status.md                    # Trạng thái Development Standards
│   │   ├── Report.md                    # Báo cáo Development Standards
│   │   ├── Checklist.md                 # Checklist Development Standards
│   │   ├── ChangeLog.md                 # Nhật ký thay đổi Development Standards
│   │   └── templates/                   # Mẫu dùng cho phase triển khai code sau này
│   │       ├── README.md                # Danh sách template phát triển
│   │       ├── development-task-report-template.md # Mẫu báo cáo task phát triển
│   │       ├── module-implementation-checklist-template.md # Mẫu checklist triển khai module
│   │       └── code-review-report-template.md # Mẫu báo cáo review code
│   ├── implementation-foundation/        # Tài liệu vận hành source foundation Prompt 14
│   │   ├── README.md                    # Mục lục implementation foundation
│   │   ├── setup-guide.md               # Hướng dẫn cài dependency, build, dev, test
│   │   ├── environment-guide.md         # Hướng dẫn biến môi trường và secret
│   │   ├── docker-guide.md              # Hướng dẫn Docker Compose Web/API/MySQL/phpMyAdmin
│   │   ├── security-baseline.md         # Nền bảo mật đã áp dụng
│   │   ├── Status.md                    # Trạng thái foundation
│   │   ├── Report.md                    # Báo cáo foundation
│   │   ├── Checklist.md                 # Checklist foundation
│   │   └── ChangeLog.md                 # Nhật ký thay đổi foundation
│   └── modules/                         # Tài liệu từng module
│       ├── README.md                    # Hướng dẫn tạo module docs
│       └── _template/                   # Mẫu tài liệu module
├── i18n/                                # Chuẩn bị đa ngôn ngữ
│   ├── README.md                        # Giới thiệu i18n
│   ├── vi/                              # Nội dung tiếng Việt
│   └── en/                              # Nội dung tiếng Anh
├── knowledge/                           # Kho tri thức riêng cho AI
│   ├── README.md                        # Giới thiệu Knowledge Base
│   ├── products/                        # Kiến thức sản phẩm
│   ├── ingredients/                     # Kiến thức thành phần
│   ├── nutrition/                       # Kiến thức dinh dưỡng
│   ├── faq/                             # Câu hỏi thường gặp
│   ├── policies/                        # Chính sách bán hàng/quyền riêng tư
│   └── marketing/                       # Kiến thức marketing
├── logs/                                # Cấu trúc log runtime
│   ├── README.md                        # Giới thiệu logging
│   ├── logging-guideline.md             # Hướng dẫn log app/security/AI
│   ├── application/                     # Log ứng dụng
│   ├── security/                        # Log bảo mật
│   ├── error/                           # Log lỗi
│   ├── audit/                           # Log audit
│   └── ai/                              # Log tương tác AI đã ẩn dữ liệu nhạy cảm
├── monitoring/                          # Giám sát hệ thống
│   ├── README.md                        # Giới thiệu monitoring
│   ├── alerts/                          # Cấu hình cảnh báo
│   ├── dashboards/                      # Dashboard theo dõi
│   └── logs/                            # Quy tắc/log mẫu, không lưu log thật
├── modules/                             # Quản lý module nghiệp vụ độc lập source code
│   ├── README.md                        # Giới thiệu business modules
│   ├── authentication/                  # Module xác thực
│   ├── users/                           # Module người dùng
│   ├── products/                        # Module sản phẩm
│   ├── categories/                      # Module danh mục
│   ├── cart/                            # Module giỏ hàng
│   ├── orders/                          # Module đơn hàng
│   ├── payment/                         # Module thanh toán
│   ├── inventory/                       # Module tồn kho
│   ├── reviews/                         # Module đánh giá
│   ├── nutrition/                       # Module dinh dưỡng
│   ├── ai/                              # Module AI Platform
│   └── marketing/                       # Module marketing
├── openapi/                             # OpenAPI 3.1 chính thức, mô tả toàn bộ API contract
│   ├── README.md                        # Hướng dẫn đọc OpenAPI
│   ├── openapi.yaml                     # File OpenAPI chính, có 194 operation thuộc 23 domain
│   ├── paths/                           # Bản đồ endpoint theo domain
│   │   ├── README.md                    # Hướng dẫn đọc paths
│   │   └── domain-map.yaml              # Mapping domain, endpoint, operationId, quyền
│   ├── schemas/                         # Schema dùng chung
│   │   └── common.yaml                  # Envelope, error, pagination, upload, AI, money, address, audit
│   ├── parameters/                      # Header, query parameter, path parameter dùng lại
│   │   └── common.yaml                  # X-Request-Id, X-Trace-Id, phân trang, filter, path ID
│   ├── responses/                       # Response chuẩn dùng lại
│   │   └── common.yaml                  # 200, 201, 202, 204, 400, 401, 403, 404, 409, 422, 429, 500, 502, 503
│   ├── examples/                        # Ví dụ request/response an toàn
│   │   └── common.yaml                  # Example không chứa secret, token thật hoặc mật khẩu
│   ├── security/                        # Security scheme cho OpenAPI
│   │   └── security-schemes.yaml        # Bearer JWT, Refresh Token, API Key, Webhook Signature
│   ├── webhooks/                        # Webhook contract
│   │   └── provider-webhooks.yaml       # Payment, shipping, notification webhook
│   ├── Status.md                        # Trạng thái OpenAPI
│   ├── Report.md                        # Báo cáo OpenAPI
│   ├── Checklist.md                     # Checklist OpenAPI
│   └── ChangeLog.md                     # Nhật ký thay đổi OpenAPI
├── packages/                            # Gói dùng chung
│   ├── README.md                        # Giới thiệu packages
│   ├── shared/                          # Package shared cũ, giữ mapping
│   ├── shared-types/                    # Type dùng chung theo Data Contract
│   ├── shared-utils/                    # Utility dùng chung
│   └── shared-config/                   # Cấu hình/hằng số dùng chung
├── legal/                               # Tài liệu pháp lý
│   ├── README.md                        # Giới thiệu legal
│   ├── privacy-policy.md                # Chính sách quyền riêng tư
│   ├── cookie-policy.md                 # Chính sách cookie
│   ├── terms-of-service.md              # Điều khoản sử dụng
│   ├── disclaimer.md                    # Tuyên bố miễn trừ
│   └── license-guideline.md             # Hướng dẫn license
├── planning/                            # Kế hoạch phát triển dài hạn
│   ├── README.md                        # Giới thiệu planning
│   ├── roadmap.md                       # Lộ trình dự án
│   ├── milestone.md                     # Cột mốc phát triển
│   ├── sprint.md                        # Kế hoạch sprint
│   └── backlog.md                       # Danh sách việc chờ
├── scripts/                             # Script hỗ trợ
│   ├── README.md                        # Giới thiệu scripts
│   ├── validate-openapi.mjs             # Kiểm tra OpenAPI YAML
│   ├── check-docs.mjs                   # Kiểm tra tài liệu bắt buộc
│   ├── check-secrets.mjs                # Quét dấu hiệu secret thật
│   ├── docker-startup-check.mjs         # Kiểm tra endpoint sau khi Docker chạy
│   ├── db/                              # Script database
│   ├── deployment/                      # Script deployment
│   └── setup/                           # Script setup môi trường
├── infra/                               # Tài liệu hạ tầng kỹ thuật mới
│   ├── README.md                        # Giới thiệu infra
│   └── docker/                          # Ghi chú Docker hạ tầng
├── configs/                             # Cấu hình dùng chung dạng mới
│   └── README.md                        # Giới thiệu configs
├── releases/                            # Quản lý release
│   ├── README.md                        # Giới thiệu release folder
│   ├── version-history.md               # Lịch sử version
│   ├── release-notes/                   # Ghi chú phát hành
│   └── checklists/                      # Checklist release
├── research/                            # Nghiên cứu thị trường và người dùng
│   ├── README.md                        # Giới thiệu research
│   ├── competitor-analysis.md           # Phân tích đối thủ
│   ├── user-persona.md                  # Chân dung người dùng
│   ├── user-journey.md                  # Hành trình người dùng
│   ├── survey.md                        # Khảo sát
│   ├── interview.md                     # Phỏng vấn
│   └── market-research.md               # Nghiên cứu thị trường
├── seo/                                 # Tài liệu SEO
│   ├── README.md                        # Giới thiệu SEO
│   ├── keywords.md                      # Từ khóa
│   ├── metadata.md                      # Metadata
│   ├── robots.md                        # Robots guideline
│   ├── sitemap.md                       # Sitemap
│   └── structured-data.md               # Structured data
├── security/                            # Tài liệu và checklist bảo mật
│   ├── README.md                        # Giới thiệu security
│   ├── checklists/                      # Checklist bảo mật
│   ├── policies/                        # Chính sách bảo mật
│   └── reports/                         # Báo cáo bảo mật
├── storage/                             # Quản lý file upload/local storage
│   ├── README.md                        # Giới thiệu storage
│   ├── uploads/                         # File upload chung
│   ├── products/                        # Ảnh sản phẩm
│   ├── certificates/                    # Chứng nhận/tài liệu kiểm định
│   ├── temporary/                       # File tạm
│   └── backup/                          # Backup file local
├── templates/                           # Template dùng chung ngoài AI
│   ├── README.md                        # Giới thiệu templates
│   ├── issue-template.md                # Mẫu tạo issue
│   ├── pull-request-template.md         # Mẫu pull request
│   ├── release-note-template.md         # Mẫu ghi chú release
│   ├── email/                           # Template email
│   │   ├── welcome.md                   # Email chào mừng
│   │   ├── verify-email.md              # Email xác thực
│   │   ├── reset-password.md            # Email đặt lại mật khẩu
│   │   ├── order-success.md             # Email đặt hàng thành công
│   │   ├── order-cancel.md              # Email hủy đơn
│   │   ├── shipping.md                  # Email giao hàng
│   │   └── promotion.md                 # Email khuyến mãi
│   └── notifications/                   # Template thông báo
│       ├── push.md                      # Push notification
│       ├── sms.md                       # SMS
│       ├── zalo.md                      # Zalo
│       └── in-app.md                    # Thông báo trong app
├── tests/                               # Test cấp hệ thống
│   ├── README.md                        # Giới thiệu tests
│   ├── e2e/                             # Test luồng người dùng
│   ├── integration/                     # Test tích hợp
│   └── performance/                     # Test hiệu năng
├── README.md                            # Giới thiệu tổng quan dự án
├── CAU_TRUC_THU_MUC.md                  # File bạn đang đọc, giải thích cấu trúc bằng tiếng Việt
├── CHANGELOG.md                         # Nhật ký thay đổi toàn dự án
├── SECURITY.md                          # Chính sách bảo mật
├── LICENSE                              # Giấy phép sử dụng source
├── .gitignore                           # File/folder Git bỏ qua
├── .env.example                         # Mẫu biến môi trường
├── .env.development.example             # Mẫu biến môi trường development
├── .env.production.example              # Mẫu biến môi trường production
├── .env.test.example                    # Mẫu biến môi trường test
├── .npmrc                               # Cấu hình npm package manager
├── .gitattributes                       # Chuẩn Git attributes/newline
├── .dockerignore                        # File bỏ qua khi build Docker image
├── .editorconfig                        # Chuẩn format editor
├── .prettierrc.json                     # Cấu hình Prettier
├── .prettierignore                      # File bỏ qua khi chạy Prettier
├── eslint.config.mjs                    # Cấu hình ESLint
├── tsconfig.base.json                   # TypeScript config dùng chung
├── package.json                         # Cấu hình npm workspace monorepo
├── package-lock.json                    # Lock dependency npm
├── workspace.json                       # Mô tả workspace apps/packages
├── build-workspace.json                 # Mô tả thứ tự build workspace
└── docker-compose.yml                   # Chạy Web, API, MySQL và phpMyAdmin bằng Docker
```

## Doc goc / Tài liệu gốc

| File | Nghĩa tiếng Việt | Dùng để làm gì |
| --- | --- | --- |
| `docs/01-folder-structure.md` | Cấu trúc thư mục | Bản chuẩn bằng tiếng Anh + tiếng Việt cho AI Agent đọc |
| `CAU_TRUC_THU_MUC.md` | Cấu trúc thư mục | Bản tiếng Việt dễ tìm, nằm ngay ngoài cùng dự án |

## Thu muc goc / Các thư mục ngoài cùng

| Thư mục | Nghĩa tiếng Việt | Dùng để làm gì |
| --- | --- | --- |
| `.github/` | GitHub workflow | CI/CD, issue template, pull request template |
| `.spec/` | Đặc tả tính năng | Nguồn chính để AI sinh code ở phase sau |
| `.ai/` | Hệ thống AI | Chứa rule, skill, prompt, template và context cho AI Agent |
| `analytics/` | Phân tích | GA4, Search Console, event, conversion, dashboard |
| `api-collections/` | API collections | Postman, Bruno, Insomnia |
| `apps/` | Ứng dụng | Chứa web app và API app |
| `apps/web/` | Giao diện web | Nơi đặt React + Vite + TypeScript + Tailwind foundation |
| `apps/api/` | Backend API | Nơi đặt Node.js + NestJS + TypeScript foundation |
| `apps/mobile/` | Mobile app | Chuẩn bị mobile app cho tương lai, chưa có code |
| `assets/` | Tài nguyên | Logo, icon, image, font, mockup, illustration, banner |
| `audit/` | Audit | Theo dõi hành động người dùng, AI và sự kiện bảo mật |
| `backup/` | Sao lưu | Chiến lược backup database, file và tài liệu |
| `business/` | Kinh doanh | Supplier, customer, promotion, voucher, pricing, revenue, cost |
| `config/` | Cấu hình | Cấu hình Docker, môi trường, bảo mật |
| `database/` | Cơ sở dữ liệu | Migration, seed, schema, sơ đồ database |
| `deployment/` | Triển khai | Tài liệu/cấu hình deploy local, staging, production |
| `design/` | Tài nguyên thiết kế | Quản lý asset, prototype, screenshot, màu/chữ/spacing placeholder |
| `docs/` | Tài liệu | Tài liệu chính của dự án |
| `infra/` | Hạ tầng | Tài liệu hạ tầng kỹ thuật và Docker |
| `configs/` | Cấu hình mới | Khu vực cấu hình mở rộng dùng cho các phase sau |
| `i18n/` | Đa ngôn ngữ | Chuẩn bị tiếng Việt và tiếng Anh |
| `knowledge/` | Kho tri thức AI | Dữ liệu riêng cho AI về sản phẩm, dinh dưỡng, FAQ |
| `legal/` | Pháp lý | Privacy, cookie, terms, disclaimer, license guideline |
| `logs/` | Logs | Cấu trúc log application, security, error, audit, AI |
| `monitoring/` | Giám sát | Dashboard, alert, log guideline |
| `modules/` | Module nghiệp vụ | Quản lý nghiệp vụ độc lập với source code |
| `openapi/` | Đặc tả OpenAPI | File OpenAPI 3.1 chính thức để backend, frontend, mobile và AI dùng chung API contract |
| `packages/` | Gói dùng chung | Shared types, utils và config dùng bởi web/API |
| `planning/` | Kế hoạch | Roadmap, milestone, sprint, backlog |
| `releases/` | Release | Version history, release notes, release checklist |
| `research/` | Nghiên cứu | Competitor, persona, journey, survey, interview, market |
| `scripts/` | Script hỗ trợ | Script setup, database, deployment |
| `seo/` | SEO | Keywords, metadata, robots, sitemap, structured data |
| `security/` | Bảo mật | Checklist, chính sách, báo cáo bảo mật |
| `storage/` | Lưu trữ file | Upload, ảnh sản phẩm, chứng nhận, file tạm |
| `templates/` | Mẫu chung | Mẫu issue, pull request, release note |
| `tests/` | Kiểm thử | Test e2e, integration, performance |

## File ngoai cung / Các file ngoài cùng

| File | Nghĩa tiếng Việt | Dùng để làm gì |
| --- | --- | --- |
| `README.md` | Giới thiệu dự án | File đọc đầu tiên để hiểu tổng quan HealthyHub |
| `CHANGELOG.md` | Nhật ký thay đổi | Ghi các thay đổi theo phiên bản |
| `SECURITY.md` | Chính sách bảo mật | Quy tắc xử lý bảo mật |
| `LICENSE` | Giấy phép | Điều khoản sử dụng source |
| `.gitignore` | File Git bỏ qua | Danh sách file không đưa lên Git |
| `.env.example` | Mẫu biến môi trường | Mẫu cấu hình database, port, secret |
| `.env.development.example` | Mẫu môi trường development | Dùng cho local development |
| `.env.production.example` | Mẫu môi trường production | Dùng để biết biến production cần có, không chứa secret thật |
| `.env.test.example` | Mẫu môi trường test | Dùng cho kiểm thử |
| `.npmrc` | Cấu hình npm | Cấu hình package manager cho workspace |
| `.gitattributes` | Cấu hình Git attribute | Chuẩn newline và cách Git xử lý text file |
| `.dockerignore` | File bỏ qua khi build Docker | Giảm build context, tránh copy file không cần vào image |
| `.prettierrc.json` | Cấu hình format | Quy tắc Prettier để format code/config |
| `.prettierignore` | File bỏ qua khi format | Tránh format tài liệu/spec lớn không cần thiết |
| `.editorconfig` | Cấu hình editor | Chuẩn indent, charset, newline |
| `eslint.config.mjs` | Cấu hình lint | Kiểm tra lỗi TypeScript, React và script |
| `tsconfig.base.json` | Cấu hình TypeScript gốc | Chuẩn TypeScript dùng chung toàn monorepo |
| `package.json` | Cấu hình monorepo | Khai báo npm workspaces và scripts chung |
| `package-lock.json` | Khóa dependency | Giúp cài dependency ổn định bằng npm |
| `workspace.json` | Mô tả workspace | Liệt kê app/package trong monorepo |
| `build-workspace.json` | Cấu hình build | Mô tả thứ tự build sau này |
| `docker-compose.yml` | Docker compose | Chạy Web, API, MySQL và phpMyAdmin cho local |

## AI System / Hệ thống AI

| Đường dẫn | Nghĩa tiếng Việt | Dùng để làm gì |
| --- | --- | --- |
| `.ai/context/` | Ngữ cảnh AI | AI đọc để hiểu dự án, domain, stack, kiến trúc |
| `.ai/rules/` | Quy tắc AI | Luật bắt buộc cho AI Agent |
| `.ai/skills/` | Kỹ năng AI | Cách AI xử lý từng loại việc |
| `.ai/prompts/` | Mẫu prompt | Prompt mẫu cho requirement, API, database, frontend, backend |
| `.ai/templates/` | Template AI | Mẫu module, checklist, report, workflow |

## Docs / Tài liệu chính

| File | Nghĩa tiếng Việt | Dùng để làm gì |
| --- | --- | --- |
| `docs/00-project-rules.md` | Quy tắc dự án | AI Agent phải đọc trước khi làm |
| `docs/01-folder-structure.md` | Cấu trúc thư mục | Bản chuẩn về cây thư mục |
| `docs/02-architecture.md` | Kiến trúc | Modular Monolith, layer, mở rộng microservice |
| `docs/03-requirement.md` | Yêu cầu | Cách ghi yêu cầu tính năng |
| `docs/04-database.md` | Database | Quy tắc bảng, cột, index, migration |
| `docs/05-api.md` | API | Quy tắc REST API |
| `docs/06-ui-ux.md` | Giao diện/trải nghiệm | Quy tắc UI tiếng Việt |
| `docs/07-frontend.md` | Frontend | Quy tắc React/Vite/TypeScript/Tailwind |
| `docs/08-backend.md` | Backend | Quy tắc Node.js/TypeScript backend |
| `docs/09-security.md` | Bảo mật | Auth, JWT, permission, validation, rate limit |
| `docs/10-performance.md` | Hiệu năng | Index, cache, pagination, tối ưu API/UI |
| `docs/11-testing.md` | Kiểm thử | Unit, integration, e2e, security test |
| `docs/12-deployment.md` | Triển khai | Local, staging, production |
| `docs/13-ai-documentation.md` | Tài liệu AI | Customer AI, Nutrition AI, Product AI, Vision AI |
| `docs/14-development-workflow.md` | Quy trình phát triển | Requirement đến Release |
| `docs/15-gateway-architecture.md` | Kiến trúc Gateway | AI, payment, storage, notification gateway |
| `docs/16-monitoring.md` | Giám sát | Metrics, logging, alert |
| `docs/17-release-management.md` | Quản lý phát hành | Version, release checklist, rollback |
| `docs/18-framework-inventory.md` | Kiểm kê framework | Danh sách file đã tạo |
| `docs/design-system/README.md` | Hệ thống thiết kế | Chuẩn token, màu, chữ, spacing, component, dark mode |
| `docs/development-standards/README.md` | Chuẩn phát triển | Chuẩn sinh code cho React, NestJS, MySQL, API, security, testing |
| `docs/implementation-foundation/README.md` | Nền tảng triển khai | Nơi đọc cách chạy workspace React/NestJS/Docker sau Prompt 14 |
| `docs/implementation-foundation/setup-guide.md` | Hướng dẫn setup | Lệnh cài dependency, build, dev, test cho workspace |
| `docs/implementation-foundation/environment-guide.md` | Hướng dẫn môi trường | Giải thích `.env.*.example` và quy tắc secret |
| `docs/implementation-foundation/docker-guide.md` | Hướng dẫn Docker | Giải thích compose Web/API/MySQL/phpMyAdmin |
| `docs/implementation-foundation/security-baseline.md` | Nền bảo mật | Bảo mật foundation trước khi có Authentication |
| `docs/framework-audit-report.md` | Báo cáo audit | Ghi phần đã có, phần bổ sung, mapping và đề xuất |
| `docs/architecture/adr/` | Quyết định kiến trúc | Template ADR cho database, AI provider, storage, architecture |
| `openapi/openapi.yaml` | OpenAPI chính thức | Đặc tả OpenAPI 3.1 thật, có endpoint, schema, response, security và webhook |
| `docs/api/openapi/openapi.yaml` | OpenAPI placeholder | File placeholder cũ, chỉ giữ mapping tài liệu |
| `docs/api/swagger/` | Swagger | Tài liệu chuẩn bị Swagger |

## Source / Nơi sau này viết code

Hiện tại đã có code nền để chạy workspace, chưa có code nghiệp vụ. Các thư mục bên dưới là nơi AI/dev sẽ viết module sau này.

| Đường dẫn | Nghĩa tiếng Việt | Dùng để làm gì |
| --- | --- | --- |
| `apps/web/src/app/` | App shell | Khung chính của web app |
| `apps/web/src/assets/` | Tài nguyên | Ảnh, icon, font nếu có |
| `apps/web/src/components/` | Component | Component UI dùng chung, hiện có error/loading/empty/toast foundation |
| `apps/web/src/modules/` | Module frontend | Giao diện theo từng module |
| `apps/web/src/pages/` | Trang | Trang shell public/customer/admin/not found bằng tiếng Việt |
| `apps/web/src/routes/` | Điều hướng | Route và route guard foundation |
| `apps/web/src/services/` | Service frontend | Axios client và chuẩn hóa lỗi API |
| `apps/web/src/shared/` | Dùng chung | Layout public/customer/admin và helper frontend |
| `apps/web/src/styles/` | Style | Tailwind/global CSS sau này |
| `apps/api/src/presentation/` | Lớp trình bày API | Controller hoặc route HTTP |
| `apps/api/src/business/` | Lớp nghiệp vụ | Service xử lý logic chính |
| `apps/api/src/data/` | Lớp dữ liệu | Repository, query, database access |
| `apps/api/src/ai/` | Lớp AI | Logic điều phối AI trong backend |
| `apps/api/src/common/` | Common backend | Filter, interceptor, middleware, logger, request context |
| `apps/api/src/config/` | Cấu hình backend | Validate biến môi trường và cấu hình runtime |
| `apps/api/src/database/` | Database backend | TypeORM config, base audit entity, transaction, seed foundation |
| `apps/api/src/gateways/` | Lớp Gateway | Contract/base gateway, chưa tích hợp provider thật |
| `apps/mobile/` | Mobile app | Chuẩn bị mobile trong tương lai, hiện chưa có code |
| `packages/shared-types/` | Type dùng chung | API envelope, pagination, error, enum, metadata |
| `packages/shared-utils/` | Hàm dùng chung | Request ID, error guard, log redaction helper |
| `packages/shared-config/` | Cấu hình dùng chung | API prefix, header, timezone, locale, sensitive key |
| `.spec/features/` | Feature spec | Nơi sau này đặt đặc tả từng tính năng |

## Implementation Foundation / Nền tảng triển khai Prompt 14

| Đường dẫn | Nghĩa tiếng Việt | Dùng để làm gì |
| --- | --- | --- |
| `apps/api/src/main.ts` | Điểm chạy API | Bootstrap NestJS, Swagger, CORS, Helmet, validation, graceful shutdown |
| `apps/api/src/app.module.ts` | Module gốc API | Nối config, database, health, gateway registry và middleware |
| `apps/api/src/presentation/health/` | Health check | Kiểm tra live/ready/database cho API |
| `apps/web/src/main.tsx` | Điểm chạy Web | Mount React app |
| `apps/web/src/app/App.tsx` | App shell Web | Bọc router, error boundary và toast provider |
| `apps/web/src/routes/AppRouter.tsx` | Route Web | Route public/customer/admin/not found |
| `docker-compose.yml` | Docker stack local | Chạy Web, API, MySQL, phpMyAdmin |
| `scripts/validate-openapi.mjs` | Kiểm OpenAPI | Parse `openapi/openapi.yaml`, kiểm operationId và ref cơ bản |
| `scripts/check-docs.mjs` | Kiểm tài liệu | Đảm bảo tài liệu bắt buộc còn tồn tại |
| `scripts/check-secrets.mjs` | Kiểm secret | Quét dấu hiệu secret thật trong source/tài liệu |
| `scripts/docker-startup-check.mjs` | Kiểm Docker | Gọi web, API health và phpMyAdmin sau khi compose chạy |

## Gateway / Các gateway đã chuẩn bị

| Gateway | Nghĩa tiếng Việt | Dùng để làm gì |
| --- | --- | --- |
| `ai` | Gateway AI | Gọi provider AI, model, prompt, fallback |
| `payment` | Gateway thanh toán | Tích hợp thanh toán |
| `storage` | Gateway lưu trữ | Upload/download file |
| `notification` | Gateway thông báo | Email, SMS, push notification |
| `ocr` | Gateway OCR | Đọc chữ từ ảnh/tài liệu |
| `vision` | Gateway thị giác | Nhận diện ảnh, QR, món ăn |
| `analytics` | Gateway phân tích | Gửi event, đọc dữ liệu phân tích |
| `integration` | Gateway tích hợp | Kết nối hệ thống ngoài |

## Module docs / Các file bắt buộc cho mỗi module

Khi tạo module mới, mỗi module phải có các file sau:

| File | Nghĩa tiếng Việt | Dùng để làm gì |
| --- | --- | --- |
| `README.md` | Tổng quan | Giới thiệu module |
| `Requirement.md` | Yêu cầu | Ghi mục tiêu, user story, acceptance criteria |
| `Database.md` | Dữ liệu | Ghi bảng, cột, quan hệ, index |
| `API.md` | API | Ghi endpoint, request, response, permission |
| `Frontend.md` | Frontend | Ghi màn hình, component, trạng thái UI |
| `Backend.md` | Backend | Ghi service, repository, validation, gateway |
| `Testing.md` | Kiểm thử | Ghi test plan |
| `Checklist.md` | Checklist | Danh sách việc phải kiểm tra |
| `Prompt.md` | Prompt | Prompt dành cho AI Agent làm module đó |
| `Status.md` | Trạng thái | Module đang ở bước nào |
| `Report.md` | Báo cáo | AI ghi đã làm gì, còn rủi ro gì |
| `ChangeLog.md` | Nhật ký thay đổi | Lịch sử thay đổi của module |
| `Decision.md` | Quyết định | Ghi quyết định kỹ thuật |
| `TODO.md` | Việc cần làm | Danh sách việc còn lại |

## Nen doc file nao truoc / Nên đọc file nào trước

Nếu bạn chỉ muốn tìm nhanh:

1. Đọc file này: `CAU_TRUC_THU_MUC.md`.
2. Muốn hiểu tổng quan dự án: `README.md`.
3. Muốn biết luật cho AI: `docs/00-project-rules.md`.
4. Muốn xem cấu trúc chuẩn: `docs/01-folder-structure.md`.
5. Muốn xem toàn bộ file đã tạo: `docs/18-framework-inventory.md`.
6. Muốn xem kết quả audit Version 1.0: `docs/framework-audit-report.md`.
7. Muốn xem báo cáo mở rộng Phase 2: `docs/framework-phase-2-enhancement-report.md`.
8. Muốn chạy source foundation: `docs/implementation-foundation/README.md`.
