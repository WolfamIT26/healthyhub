# Folder Structure / Cấu trúc thư mục

## Overview / Tổng quan

Cấu trúc này tách rõ source code, tài liệu, AI system, cấu hình, bảo mật, kiểm thử, triển khai, monitoring, logging, audit, backup, storage, planning, design system, OpenAPI, assets, research, SEO, analytics, legal, release, scripts và templates.

## Tree / Cây thư mục

```text
healthyhub/
├── .spec/
│   ├── _template/
│   ├── features/
│   ├── domain/
│   ├── database/
│   ├── database-physical/
│   ├── data-contracts/
│   ├── api/
│   └── ui-contract/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy.yml
│   │   └── test.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── .ai/
│   ├── agents/
│   ├── checklists/
│   ├── context/
│   ├── context-packs/
│   ├── examples/
│   ├── knowledge/
│   ├── memory/
│   ├── personas/
│   ├── prompts/
│   ├── registry/
│   ├── reviewers/
│   ├── rules/
│   ├── skills/
│   ├── templates/
│   ├── validators/
│   └── workflows/
├── analytics/
├── api-collections/
│   ├── bruno/
│   ├── insomnia/
│   └── postman/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── ai/
│   │       ├── business/
│   │       ├── data/
│   │       ├── gateways/
│   │       └── presentation/
│   ├── mobile/
│   │   ├── src/
│   │   └── tests/
│   └── web/
│       └── src/
│           ├── app/
│           ├── assets/
│           ├── components/
│           ├── modules/
│           ├── pages/
│           ├── routes/
│           ├── services/
│           ├── shared/
│           └── styles/
├── audit/
│   ├── README.md
│   ├── ai-actions.md
│   ├── security-events.md
│   └── user-actions.md
├── assets/
│   ├── banners/
│   ├── fonts/
│   ├── icons/
│   ├── illustrations/
│   ├── images/
│   ├── logos/
│   └── mockups/
├── backup/
│   ├── database/
│   ├── documents/
│   ├── files/
│   ├── daily-backup.md
│   ├── disaster-recovery.md
│   ├── monthly-backup.md
│   ├── backup-strategy.md
│   ├── restore-guideline.md
│   └── weekly-backup.md
├── business/
├── config/
│   ├── docker/
│   ├── env/
│   ├── security/
│   └── workspace/
├── database/
│   ├── diagrams/
│   │   ├── drawio/
│   │   ├── pdf/
│   │   └── png/
│   ├── migrations/
│   ├── schemas/
│   └── seeds/
├── deployment/
│   ├── docker/
│   └── environments/
├── design/
│   ├── colors/
│   ├── components/
│   ├── icons/
│   ├── prototype/
│   ├── screenshots/
│   ├── spacing/
│   └── typography/
├── docs/
│   ├── api/
│   │   ├── openapi/
│   │   └── swagger/
│   ├── architecture/
│   │   └── adr/
│   ├── business-blueprint/
│   ├── design-system/
│   │   └── components/
│   ├── development-standards/
│   │   └── templates/
│   ├── implementation-foundation/
│   └── modules/
├── i18n/
│   ├── en/
│   └── vi/
├── knowledge/
│   ├── faq/
│   ├── ingredients/
│   ├── marketing/
│   ├── nutrition/
│   ├── policies/
│   └── products/
├── logs/
│   ├── ai/
│   ├── application/
│   ├── audit/
│   ├── error/
│   └── security/
├── monitoring/
│   ├── alerts/
│   ├── dashboards/
│   └── logs/
├── modules/
│   ├── ai/
│   ├── authentication/
│   ├── cart/
│   ├── categories/
│   ├── inventory/
│   ├── marketing/
│   ├── nutrition/
│   ├── orders/
│   ├── payment/
│   ├── products/
│   ├── reviews/
│   ├── users/
│   └── wishlist/
├── openapi/
│   ├── examples/
│   ├── parameters/
│   ├── paths/
│   ├── responses/
│   ├── schemas/
│   ├── security/
│   ├── webhooks/
│   └── openapi.yaml
├── packages/
│   ├── shared/
│   ├── shared-config/
│   ├── shared-types/
│   └── shared-utils/
├── planning/
│   ├── backlog.md
│   ├── milestone.md
│   ├── roadmap.md
│   └── sprint.md
├── scripts/
│   ├── db/
│   ├── deployment/
│   └── setup/
├── infra/
│   └── docker/
├── configs/
├── security/
│   ├── checklists/
│   ├── policies/
│   └── reports/
├── storage/
│   ├── backup/
│   ├── certificates/
│   ├── products/
│   ├── temporary/
│   └── uploads/
├── templates/
│   ├── email/
│   └── notifications/
├── legal/
├── releases/
│   ├── checklists/
│   └── release-notes/
├── research/
├── seo/
└── tests/
    ├── e2e/
    ├── integration/
    └── performance/
```

## Required Root Files / File bắt buộc ở root

- `README.md`
- `CAU_TRUC_THU_MUC.md`
- `TONG_HOP_DA_LAM.md`
- `CHANGELOG.md`
- `SECURITY.md`
- `LICENSE`
- `.gitignore`
- `.npmrc`
- `.gitattributes`
- `.dockerignore`
- `.prettierrc.json`
- `.prettierignore`
- `.env.example`
- `.env.development.example`
- `.env.production.example`
- `.env.test.example`
- `.editorconfig`
- `eslint.config.mjs`
- `tsconfig.base.json`
- `docker-compose.yml`
- `package.json`
- `package-lock.json`
- `workspace.json`
- `build-workspace.json`

## Module Documentation Files / File tài liệu bắt buộc cho mỗi module

- `README.md`
- `Requirement.md`
- `Database.md`
- `API.md`
- `Frontend.md`
- `Backend.md`
- `Testing.md`
- `Checklist.md`
- `Prompt.md`
- `Status.md`
- `Report.md`
- `ChangeLog.md`
- `Decision.md`
- `TODO.md`
