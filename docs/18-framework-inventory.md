# Framework Inventory / Kiểm kê framework

## Purpose / Mục tiêu

Tài liệu này liệt kê các phần đã được tạo để đáp ứng bộ khung AI Development Framework cho HealthyHub.

## Output Mapping / Đối chiếu yêu cầu đầu ra

| Required Output / Đầu ra yêu cầu | Created Location / Vị trí đã tạo |
| --- | --- |
| Full project folder structure | `docs/01-folder-structure.md` |
| Danh sách file cần có | Tài liệu này |
| Template Markdown | `.ai/templates`, `templates`, `docs/modules/_template` |
| AI Skill System | `.ai/skills` |
| AI Rule System | `.ai/rules` |
| Prompt Template System | `.ai/prompts` |
| Module Template System | `.ai/templates/module`, `docs/modules/_template` |
| Development Workflow | `docs/14-development-workflow.md`, `.ai/templates/workflow` |
| Checklist System | `.ai/templates/checklists` |
| OpenAPI Specification | `openapi/openapi.yaml` |
| Không code nghiệp vụ | Chỉ có README và `.gitkeep` trong source placeholders |

## Root Files / File root

- `README.md`
- `CHANGELOG.md`
- `SECURITY.md`
- `LICENSE`
- `.gitignore`
- `.gitattributes`
- `.dockerignore`
- `.env.example`
- `.env.development.example`
- `.env.production.example`
- `.env.test.example`
- `.npmrc`
- `.editorconfig`
- `.prettierrc.json`
- `.prettierignore`
- `eslint.config.mjs`
- `tsconfig.base.json`
- `docker-compose.yml`
- `package.json`
- `package-lock.json`
- `workspace.json`
- `build-workspace.json`
- `CAU_TRUC_THU_MUC.md`
- `TONG_HOP_DA_LAM.md`

## Source Structure / Cấu trúc source

- `apps/README.md`
- `apps/web/README.md`
- `apps/web/src/.gitkeep`
- `apps/web/src/app/.gitkeep`
- `apps/web/src/assets/.gitkeep`
- `apps/web/src/components/.gitkeep`
- `apps/web/src/modules/.gitkeep`
- `apps/web/src/pages/.gitkeep`
- `apps/web/src/routes/.gitkeep`
- `apps/web/src/services/.gitkeep`
- `apps/web/src/shared/.gitkeep`
- `apps/web/src/styles/.gitkeep`
- `apps/web/public/.gitkeep`
- `apps/web/tests/.gitkeep`
- `apps/api/README.md`
- `apps/api/src/.gitkeep`
- `apps/api/src/presentation/.gitkeep`
- `apps/api/src/business/.gitkeep`
- `apps/api/src/data/.gitkeep`
- `apps/api/src/ai/.gitkeep`
- `apps/api/src/gateways/README.md`
- `apps/api/src/gateways/ai/.gitkeep`
- `apps/api/src/gateways/payment/.gitkeep`
- `apps/api/src/gateways/storage/.gitkeep`
- `apps/api/src/gateways/notification/.gitkeep`
- `apps/api/src/gateways/ocr/.gitkeep`
- `apps/api/src/gateways/vision/.gitkeep`
- `apps/api/src/gateways/analytics/.gitkeep`
- `apps/api/src/gateways/integration/.gitkeep`
- `apps/api/tests/.gitkeep`
- `apps/mobile/README.md`
- `apps/mobile/src/.gitkeep`
- `apps/mobile/tests/.gitkeep`
- `package.json`
- `.npmrc`
- `workspace.json`
- `build-workspace.json`
- `config/workspace/README.md`
- `config/workspace/workspace-management.md`
- `config/workspace/package-manager.md`
- `config/workspace/build-workspace.md`

## Documentation Files / File tài liệu

- `docs/README.md`
- `docs/00-project-rules.md`
- `docs/01-folder-structure.md`
- `docs/02-architecture.md`
- `docs/03-requirement.md`
- `docs/04-database.md`
- `docs/05-api.md`
- `docs/06-ui-ux.md`
- `docs/07-frontend.md`
- `docs/08-backend.md`
- `docs/09-security.md`
- `docs/10-performance.md`
- `docs/11-testing.md`
- `docs/12-deployment.md`
- `docs/13-ai-documentation.md`
- `docs/14-development-workflow.md`
- `docs/15-gateway-architecture.md`
- `docs/16-monitoring.md`
- `docs/17-release-management.md`
- `docs/18-framework-inventory.md`
- `docs/framework-audit-report.md`
- `docs/framework-phase-2-enhancement-report.md`
- `docs/architecture/README.md`
- `docs/architecture/adr/README.md`
- `docs/architecture/adr/ADR-001-template.md`
- `docs/architecture/adr/ADR-002-database-decision-template.md`
- `docs/architecture/adr/ADR-003-ai-provider-decision-template.md`
- `docs/architecture/adr/ADR-004-storage-decision-template.md`
- `docs/architecture/adr/ADR-005-architecture-decision-template.md`
- `docs/architecture/adr/ADR-006-backend-framework-nestjs.md`
- `docs/api/README.md`
- `docs/api/openapi/README.md`
- `docs/api/openapi/openapi.yaml`
- `docs/api/swagger/README.md`
- `docs/design-system/README.md`
- `docs/design-system/design-principles.md`
- `docs/design-system/design-tokens.md`
- `docs/design-system/colors.md`
- `docs/design-system/typography.md`
- `docs/design-system/spacing.md`
- `docs/design-system/border-radius.md`
- `docs/design-system/elevation.md`
- `docs/design-system/shadow.md`
- `docs/design-system/grid.md`
- `docs/design-system/breakpoints.md`
- `docs/design-system/icon-guideline.md`
- `docs/design-system/illustration-guideline.md`
- `docs/design-system/motion-guideline.md`
- `docs/design-system/dark-mode.md`
- `docs/design-system/accessibility-guideline.md`
- `docs/design-system/component-library.md`
- `docs/design-system/component-usage-map.md`
- `docs/design-system/Status.md`
- `docs/design-system/Report.md`
- `docs/design-system/Checklist.md`
- `docs/design-system/ChangeLog.md`
- `docs/design-system/components/README.md`
- `docs/design-system/components/*.md`
- `docs/development-standards/README.md`
- `docs/development-standards/coding-standards.md`
- `docs/development-standards/typescript-style-guide.md`
- `docs/development-standards/react-style-guide.md`
- `docs/development-standards/tailwind-style-guide.md`
- `docs/development-standards/nestjs-style-guide.md`
- `docs/development-standards/mysql-style-guide.md`
- `docs/development-standards/api-implementation-standard.md`
- `docs/development-standards/data-contract-implementation.md`
- `docs/development-standards/gateway-standard.md`
- `docs/development-standards/folder-convention.md`
- `docs/development-standards/naming-convention.md`
- `docs/development-standards/import-export-convention.md`
- `docs/development-standards/error-handling-standard.md`
- `docs/development-standards/logging-standard.md`
- `docs/development-standards/validation-standard.md`
- `docs/development-standards/security-standard.md`
- `docs/development-standards/performance-standard.md`
- `docs/development-standards/accessibility-standard.md`
- `docs/development-standards/seo-standard.md`
- `docs/development-standards/testing-standard.md`
- `docs/development-standards/documentation-standard.md`
- `docs/development-standards/environment-standard.md`
- `docs/development-standards/docker-standard.md`
- `docs/development-standards/git-workflow.md`
- `docs/development-standards/branching-strategy.md`
- `docs/development-standards/commit-convention.md`
- `docs/development-standards/code-review-standard.md`
- `docs/development-standards/dependency-management.md`
- `docs/development-standards/versioning-release-standard.md`
- `docs/development-standards/ai-code-generation-rules.md`
- `docs/development-standards/vertical-slice-workflow.md`
- `docs/development-standards/module-done-definition.md`
- `docs/development-standards/Status.md`
- `docs/development-standards/Report.md`
- `docs/development-standards/Checklist.md`
- `docs/development-standards/ChangeLog.md`
- `docs/development-standards/templates/README.md`
- `docs/development-standards/templates/*.md`

## Specification Files / File đặc tả

- `.spec/README.md`
- `.spec/features/README.md`
- `.spec/features/Status.md`
- `.spec/features/Report.md`
- `.spec/features/Checklist.md`
- `.spec/features/ChangeLog.md`
- `.spec/features/*/README.md`
- `.spec/domain/README.md`
- `.spec/domain/domain-overview.md`
- `.spec/domain/domain-dependency-map.md`
- `.spec/domain/ubiquitous-language.md`
- `.spec/domain/business-constraints.md`
- `.spec/domain/Status.md`
- `.spec/domain/Report.md`
- `.spec/domain/Checklist.md`
- `.spec/domain/ChangeLog.md`
- `.spec/domain/domains/*.md`
- `.spec/database/README.md`
- `.spec/database/database-standards.md`
- `.spec/database/domain-data-map.md`
- `.spec/database/cross-domain-relationships.md`
- `.spec/database/logical-erd.md`
- `.spec/database/data-readiness.md`
- `.spec/database/Status.md`
- `.spec/database/Report.md`
- `.spec/database/Checklist.md`
- `.spec/database/ChangeLog.md`
- `.spec/database/domains/*.md`
- `.spec/database-physical/README.md`
- `.spec/database-physical/physical-standards.md`
- `.spec/database-physical/relationship-rules.md`
- `.spec/database-physical/index-catalog.md`
- `.spec/database-physical/performance-strategy.md`
- `.spec/database-physical/migration-strategy.md`
- `.spec/database-physical/backup-recovery.md`
- `.spec/database-physical/Status.md`
- `.spec/database-physical/Report.md`
- `.spec/database-physical/Checklist.md`
- `.spec/database-physical/ChangeLog.md`
- `.spec/database-physical/domains/*.md`
- `.spec/data-contracts/README.md`
- `.spec/data-contracts/contract-standards.md`
- `.spec/data-contracts/data-format-standards.md`
- `.spec/data-contracts/request-model.md`
- `.spec/data-contracts/response-model.md`
- `.spec/data-contracts/api-envelope.md`
- `.spec/data-contracts/pagination-contract.md`
- `.spec/data-contracts/filter-search-sort-contract.md`
- `.spec/data-contracts/file-transfer-contract.md`
- `.spec/data-contracts/error-standard.md`
- `.spec/data-contracts/validation-response.md`
- `.spec/data-contracts/ai-response.md`
- `.spec/data-contracts/metadata-contract.md`
- `.spec/data-contracts/enum-contract.md`
- `.spec/data-contracts/versioning.md`
- `.spec/data-contracts/domain-contract-map.md`
- `.spec/data-contracts/Status.md`
- `.spec/data-contracts/Report.md`
- `.spec/data-contracts/Checklist.md`
- `.spec/data-contracts/ChangeLog.md`
- `.spec/api/README.md`
- `.spec/api/api-conventions.md`
- `.spec/api/security.md`
- `.spec/api/authentication-flow.md`
- `.spec/api/error-catalog.md`
- `.spec/api/domain-api-map.md`
- `.spec/api/endpoint-matrix.md`
- `.spec/api/rate-limit-policy.md`
- `.spec/api/webhook-policy.md`
- `.spec/api/Status.md`
- `.spec/api/Report.md`
- `.spec/api/Checklist.md`
- `.spec/api/ChangeLog.md`
- `.spec/api/domains/README.md`
- `.spec/api/domains/*.md`
- `.spec/ui-contract/README.md`
- `.spec/ui-contract/ui-contract-standards.md`
- `.spec/ui-contract/navigation.md`
- `.spec/ui-contract/screen-flow.md`
- `.spec/ui-contract/component-mapping.md`
- `.spec/ui-contract/state-contract.md`
- `.spec/ui-contract/Status.md`
- `.spec/ui-contract/Report.md`
- `.spec/ui-contract/Checklist.md`
- `.spec/ui-contract/ChangeLog.md`
- `.spec/ui-contract/screens/README.md`
- `.spec/ui-contract/screens/*.md`

## OpenAPI Files / File OpenAPI

- `openapi/README.md`
- `openapi/openapi.yaml`
- `openapi/paths/README.md`
- `openapi/paths/domain-map.yaml`
- `openapi/schemas/common.yaml`
- `openapi/parameters/common.yaml`
- `openapi/responses/common.yaml`
- `openapi/examples/common.yaml`
- `openapi/security/security-schemes.yaml`
- `openapi/webhooks/provider-webhooks.yaml`
- `openapi/Status.md`
- `openapi/Report.md`
- `openapi/Checklist.md`
- `openapi/ChangeLog.md`

## Implementation Foundation Files / File nền tảng triển khai

### Root Workspace / Workspace gốc

- `package.json`
- `package-lock.json`
- `workspace.json`
- `build-workspace.json`
- `tsconfig.base.json`
- `eslint.config.mjs`
- `.prettierrc.json`
- `.prettierignore`
- `.dockerignore`
- `.gitattributes`

### API Foundation / Nền API

- `apps/api/package.json`
- `apps/api/nest-cli.json`
- `apps/api/tsconfig.json`
- `apps/api/tsconfig.build.json`
- `apps/api/vitest.config.ts`
- `apps/api/vitest.integration.config.ts`
- `apps/api/Dockerfile`
- `apps/api/src/main.ts`
- `apps/api/src/app.module.ts`
- `apps/api/src/config/environment.ts`
- `apps/api/src/common/filters/http-exception.filter.ts`
- `apps/api/src/common/interceptors/response-envelope.interceptor.ts`
- `apps/api/src/common/logging/app-logger.service.ts`
- `apps/api/src/common/middleware/rate-limit.middleware.ts`
- `apps/api/src/common/middleware/request-context.middleware.ts`
- `apps/api/src/common/types/request-with-context.ts`
- `apps/api/src/database/base-audit.entity.ts`
- `apps/api/src/database/data-source.ts`
- `apps/api/src/database/typeorm.config.ts`
- `apps/api/src/database/transaction/transaction-runner.ts`
- `apps/api/src/database/seed/seed.ts`
- `apps/api/src/presentation/health/health.controller.ts`
- `apps/api/src/presentation/health/health.module.ts`
- `apps/api/src/gateways/base/base-gateway.ts`
- `apps/api/src/gateways/base/gateway.types.ts`
- `apps/api/src/gateways/gateway-registry.module.ts`
- `apps/api/src/gateways/*/*-gateway.ts`

### Web Foundation / Nền Web

- `apps/web/package.json`
- `apps/web/index.html`
- `apps/web/tsconfig.json`
- `apps/web/vite.config.ts`
- `apps/web/tailwind.config.ts`
- `apps/web/postcss.config.cjs`
- `apps/web/Dockerfile`
- `apps/web/src/main.tsx`
- `apps/web/src/app/App.tsx`
- `apps/web/src/config/env.ts`
- `apps/web/src/routes/AppRouter.tsx`
- `apps/web/src/routes/RouteGuard.tsx`
- `apps/web/src/pages/*.tsx`
- `apps/web/src/shared/layouts/*.tsx`
- `apps/web/src/components/foundation/*.tsx`
- `apps/web/src/services/api/*.ts`
- `apps/web/src/styles/index.css`

### Shared Packages / Package dùng chung

- `packages/shared-types/package.json`
- `packages/shared-types/tsconfig.json`
- `packages/shared-types/src/index.ts`
- `packages/shared-utils/package.json`
- `packages/shared-utils/tsconfig.json`
- `packages/shared-utils/src/index.ts`
- `packages/shared-config/package.json`
- `packages/shared-config/tsconfig.json`
- `packages/shared-config/src/index.ts`

### Scripts and CI / Script và CI

- `scripts/validate-openapi.mjs`
- `scripts/check-docs.mjs`
- `scripts/check-secrets.mjs`
- `scripts/docker-startup-check.mjs`
- `.github/workflows/ci.yml`
- `.github/workflows/test.yml`
- `.github/workflows/deploy.yml`

### Implementation Documentation / Tài liệu triển khai

- `docs/implementation-foundation/README.md`
- `docs/implementation-foundation/setup-guide.md`
- `docs/implementation-foundation/environment-guide.md`
- `docs/implementation-foundation/docker-guide.md`
- `docs/implementation-foundation/security-baseline.md`
- `docs/implementation-foundation/Status.md`
- `docs/implementation-foundation/Report.md`
- `docs/implementation-foundation/Checklist.md`
- `docs/implementation-foundation/ChangeLog.md`

## Module Template Files / File template module

- `docs/modules/README.md`
- `docs/modules/_template/README.md`
- `docs/modules/_template/Requirement.md`
- `docs/modules/_template/Database.md`
- `docs/modules/_template/API.md`
- `docs/modules/_template/Frontend.md`
- `docs/modules/_template/Backend.md`
- `docs/modules/_template/Testing.md`
- `docs/modules/_template/Checklist.md`
- `docs/modules/_template/Prompt.md`
- `docs/modules/_template/Status.md`
- `docs/modules/_template/Report.md`
- `docs/modules/_template/ChangeLog.md`
- `docs/modules/_template/Decision.md`
- `docs/modules/_template/TODO.md`

## AI System Files / File hệ thống AI

- `.ai/README.md`
- `.ai/context/README.md`
- `.ai/context/project-context.md`
- `.ai/context/healthyhub-domain.md`
- `.ai/context/technology-stack.md`
- `.ai/context/architecture-context.md`
- `.ai/context/gateway-context.md`
- `.ai/context/ai-capability-map.md`
- `.ai/context/development-workflow-context.md`
- `.ai/context/context-management.md`
- `.ai/rules/README.md`
- `.ai/rules/00-agent-mandatory-rules.md`
- `.ai/rules/01-language-and-naming-rules.md`
- `.ai/rules/02-project-architecture-rules.md`
- `.ai/rules/03-documentation-rules.md`
- `.ai/rules/04-security-rules.md`
- `.ai/rules/05-ai-layer-rules.md`
- `.ai/rules/06-gateway-rules.md`
- `.ai/rules/07-testing-rules.md`
- `.ai/rules/08-ai-workflow-rules.md`
- `.ai/rules/09-token-optimization-rules.md`
- `.ai/skills/README.md`
- `.ai/skills/00-ai-agent-operating-system.md`
- `.ai/skills/01-requirement-analysis-skill.md`
- `.ai/skills/02-architecture-design-skill.md`
- `.ai/skills/03-database-design-skill.md`
- `.ai/skills/04-api-design-skill.md`
- `.ai/skills/05-frontend-design-skill.md`
- `.ai/skills/06-backend-design-skill.md`
- `.ai/skills/07-ai-feature-design-skill.md`
- `.ai/skills/08-testing-review-skill.md`
- `.ai/skills/09-documentation-update-skill.md`
- `.ai/skills/10-release-management-skill.md`
- `.ai/prompts/README.md`
- `.ai/prompts/00-master-agent-prompt.md`
- `.ai/prompts/01-project-initialization-prompt.md`
- `.ai/prompts/02-module-initialization-prompt.md`
- `.ai/prompts/03-requirement-analysis-prompt.md`
- `.ai/prompts/04-architecture-design-prompt.md`
- `.ai/prompts/05-database-design-prompt.md`
- `.ai/prompts/06-api-design-prompt.md`
- `.ai/prompts/07-frontend-design-prompt.md`
- `.ai/prompts/08-backend-development-prompt.md`
- `.ai/prompts/09-ai-feature-prompt.md`
- `.ai/prompts/10-testing-prompt.md`
- `.ai/prompts/11-review-prompt.md`
- `.ai/prompts/12-documentation-update-prompt.md`
- `.ai/prompts/13-release-prompt.md`
- `.ai/prompts/14-prompt-standard.md`
- `.ai/templates/README.md`
- `.ai/templates/module/README.md`
- `.ai/templates/module/Requirement.md`
- `.ai/templates/module/Database.md`
- `.ai/templates/module/API.md`
- `.ai/templates/module/Frontend.md`
- `.ai/templates/module/Backend.md`
- `.ai/templates/module/Testing.md`
- `.ai/templates/module/Checklist.md`
- `.ai/templates/module/Prompt.md`
- `.ai/templates/module/Status.md`
- `.ai/templates/module/Report.md`
- `.ai/templates/module/ChangeLog.md`
- `.ai/templates/module/Decision.md`
- `.ai/templates/module/TODO.md`
- `.ai/templates/workflow/00-development-flow.md`
- `.ai/templates/workflow/01-requirement-template.md`
- `.ai/templates/workflow/02-architecture-template.md`
- `.ai/templates/workflow/03-release-template.md`
- `.ai/templates/checklists/README.md`
- `.ai/templates/checklists/development-checklist.md`
- `.ai/templates/checklists/security-checklist.md`
- `.ai/templates/checklists/ai-feature-checklist.md`
- `.ai/templates/checklists/ai-review-checklist.md`
- `.ai/templates/checklists/release-checklist.md`
- `.ai/templates/reports/status-template.md`
- `.ai/templates/reports/report-template.md`
- `.ai/templates/reports/decision-template.md`
- `.ai/templates/reports/changelog-template.md`

## Support Folders / Thư mục hỗ trợ

- `.spec`
- `.github`
- `analytics`
- `api-collections`
- `assets`
- `audit`
- `backup`
- `business`
- `database`
- `config`
- `design`
- `i18n`
- `knowledge`
- `legal`
- `logs`
- `scripts`
- `tests`
- `deployment`
- `monitoring`
- `modules`
- `security`
- `storage`
- `templates`
- `packages`
- `planning`
- `releases`
- `research`
- `seo`

## Version 1.0 Audit Additions / Bổ sung sau audit Version 1.0

### GitHub Development System / Hệ thống GitHub

- `.github/workflows/ci.yml`
- `.github/workflows/test.yml`
- `.github/workflows/deploy.yml`
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/PULL_REQUEST_TEMPLATE.md`

### Environment Management / Quản lý môi trường

- `.env.development.example`
- `.env.production.example`
- `.env.test.example`
- `config/env/environment-management.md`

### Backup, Storage, Logs, Audit / Sao lưu, lưu trữ, log, audit

- `backup/README.md`
- `backup/backup-strategy.md`
- `backup/restore-guideline.md`
- `storage/README.md`
- `logs/README.md`
- `logs/logging-guideline.md`
- `audit/README.md`
- `audit/user-actions.md`
- `audit/ai-actions.md`
- `audit/security-events.md`

### AI Knowledge and Business Modules / Kho tri thức AI và module nghiệp vụ

- `knowledge/README.md`
- `knowledge/products/README.md`
- `knowledge/ingredients/README.md`
- `knowledge/nutrition/README.md`
- `knowledge/faq/README.md`
- `knowledge/policies/README.md`
- `knowledge/marketing/README.md`
- `modules/README.md`
- `modules/authentication`
- `modules/users`
- `modules/products`
- `modules/categories`
- `modules/cart`
- `modules/orders`
- `modules/payment`
- `modules/inventory`
- `modules/reviews`
- `modules/nutrition`
- `modules/ai`
- `modules/marketing`

### Planning, ADR, Design, Mobile / Kế hoạch, ADR, thiết kế, mobile

- `planning/roadmap.md`
- `planning/milestone.md`
- `planning/sprint.md`
- `planning/backlog.md`
- `docs/architecture/adr`
- `design`
- `apps/mobile`

### Security and AI Enhancement / Bổ sung bảo mật và AI

- `security/checklists/security-baseline-checklist.md`
- `security/policies/authentication.md`
- `security/policies/authorization.md`
- `security/policies/jwt.md`
- `security/policies/permission.md`
- `security/policies/owasp-guideline.md`
- `security/policies/data-privacy.md`
- `.ai/rules/08-ai-workflow-rules.md`
- `.ai/rules/09-token-optimization-rules.md`
- `.ai/prompts/14-prompt-standard.md`
- `.ai/context/context-management.md`
- `.ai/templates/checklists/ai-review-checklist.md`

## Mapping Notes / Ghi chú mapping

- `docs/modules/_template` và `.ai/templates/module` là template tài liệu module; `modules/` là nơi quản lý module nghiệp vụ độc lập với source code.
- `monitoring/logs` là guideline/placeholder cho monitoring; `logs/` là cấu trúc log runtime.
- `storage/backup` là backup file local; `backup/` là hệ thống backup tổng thể.
- `docs/api/openapi` và `docs/api/swagger` là tài liệu API; `api-collections` là collection cho Postman, Bruno và Insomnia.
- `apps/web/src/assets` là runtime assets của web; `assets` root là kho tài nguyên chung.
- `docs/17-release-management.md` là guideline release; `releases` là thư mục lưu version history, release notes và checklist.

## Phase 2 Additions / Bổ sung Phase 2

### Workspace Management / Quản lý workspace

- `package.json`
- `.npmrc`
- `workspace.json`
- `build-workspace.json`
- `config/workspace/README.md`
- `config/workspace/workspace-management.md`
- `config/workspace/package-manager.md`
- `config/workspace/build-workspace.md`

### Assets System / Hệ thống assets

- `assets/README.md`
- `assets/logos/README.md`
- `assets/icons/README.md`
- `assets/images/README.md`
- `assets/fonts/README.md`
- `assets/mockups/README.md`
- `assets/illustrations/README.md`
- `assets/banners/README.md`

### Email and Notification Templates / Template email và thông báo

- `templates/email`
- `templates/notifications`

### Internationalization / Đa ngôn ngữ

- `i18n/README.md`
- `i18n/vi/README.md`
- `i18n/en/README.md`

### OpenAPI and API Collections / OpenAPI và API collections

- `openapi/openapi.yaml`
- `openapi/schemas/common.yaml`
- `openapi/parameters/common.yaml`
- `openapi/responses/common.yaml`
- `openapi/examples/common.yaml`
- `openapi/security/security-schemes.yaml`
- `openapi/webhooks/provider-webhooks.yaml`
- `docs/api/openapi/openapi.yaml`
- `docs/api/swagger`
- `api-collections/postman`
- `api-collections/bruno`
- `api-collections/insomnia`

### Database ERD and UI Prototype / ERD và prototype

- `database/diagrams/drawio`
- `database/diagrams/png`
- `database/diagrams/pdf`
- `design/prototype/wireframes`
- `design/prototype/user-flows`
- `design/prototype/prototypes`
- `design/prototype/ui-mapping`

### AI Memory, Personas, Context Packs, Examples / AI memory, persona, context pack, ví dụ

- `.ai/memory`
- `.ai/personas`
- `.ai/context-packs`
- `.ai/examples`

### Research, SEO, Analytics, Legal, Business / Nghiên cứu, SEO, phân tích, pháp lý, kinh doanh

- `research`
- `seo`
- `analytics`
- `legal`
- `business`

### Backup and Release Enhancement / Bổ sung backup và release

- `backup/daily-backup.md`
- `backup/weekly-backup.md`
- `backup/monthly-backup.md`
- `backup/disaster-recovery.md`
- `releases`

### Feature Specification / Đặc tả tính năng

- `.spec/README.md`
- `.spec/_template`
- `.spec/features`
