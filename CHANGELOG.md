# ChangeLog / Nhật ký thay đổi

## [0.13.4] - 2026-08-09

### Added / Đã thêm

- Thêm transactional Order/OrderItem/Payment/Shipment/address snapshot persistence và Customer-only `POST /orders`.
- Thêm server-authoritative totals/revalidation, hash-based idempotency, migration/unit/MySQL integration tests và typed OpenAPI Order contract.

### Notes / Ghi chú

- COD/Shipment bắt đầu `pending`; không capture, fulfillment hoặc mutate Inventory/Cart.
- Checkout dependency matrix READY và Prompt 26.2 được mở khóa; Checkout UI chưa triển khai.

## [0.13.3] - 2026-08-09

### Added / Đã thêm

- Thêm internal Shipping V1 authority: manual method, VN address validation/snapshot, deterministic quote và authoritative `0.00 VND` fee.
- Thêm Shipping unit tests và documentation/decision cho Prompt 26.1A.

### Notes / Ghi chú

- Không tích hợp provider, ETA, Shipment fulfillment, Order hoặc Checkout UI.
- Checkout còn BLOCKED duy nhất bởi Order Creation Boundary.

## [0.13.2] - 2026-08-09

### Added / Đã thêm

- Thêm internal COD-only Payment method foundation với trạng thái `pending`, không capture và không fake paid.
- Thêm Shipping/Payment/Order dependency reports cho Prompt 26.1.

### Notes / Ghi chú

- Shipping Authority và Order Creation Boundary vẫn BLOCKED; Prompt 26.2 chưa được mở khóa.
- Không dùng `manual/0.00` storage defaults làm shipping quote rule và không tạo incomplete Order/Shipment.

## [0.13.1] - 2026-08-09

### Documentation / Tài liệu

- Audit Prompt 26 xác nhận Checkout bị chặn bởi Shipping quote authority, approved Payment method list và Order create/idempotency chưa executable.
- Thêm bộ tài liệu `modules/checkout`, `docs/checkout.md` và work summary.

### Notes / Ghi chú

- Không tạo fake shipping fee, COD/payment success, Order row hoặc Checkout form không thể hoàn tất.
- Cart server persistence và Authentication verification policy không thay đổi.

## [0.13.0] - 2026-08-09

### Added / Đã thêm

- Thêm MySQL Cart/CartItem persistence, transactional repository và Customer-only Cart API.
- Thêm Cart-specific OpenAPI request/read model, authoritative Product price/Inventory availability và exact subtotal.
- Thêm development commerce seed idempotent cùng MySQL concurrency/ownership/reload integration coverage.

### Changed / Đã cập nhật

- CartProvider chuyển từ transient memory sang server-backed fetch/add/update/remove; Header count và Cart page dùng server response.
- Product Catalog presentation IDs được căn chỉnh với approved BIGINT Product IDs.

### Notes / Ghi chú

- Cart Persistence: Server-side implemented.
- Guest Cart/merge, Coupon, Checkout, Inventory reservation/mutation, Order và Payment chưa triển khai.

## [0.12.0] - 2026-08-09

### Added / Đã thêm

- Thêm Product, Inventory và CustomerProfile MySQL/TypeORM foundation tối thiểu để Cart dùng server authority.
- Thêm internal `ProductCommerceReader`, `InventoryAvailabilityReader`, `CustomerOwnerResolver` và unit/MySQL integration coverage.
- Authentication Register tạo CustomerProfile theo lifecycle đã approved.

### Notes / Ghi chú

- Migration đã chạy thật và không còn pending; ba Cart dependency chuyển READY.
- Không triển khai Cart persistence, public CRUD API, Inventory mutation/reservation, Customer UI hoặc sửa OpenAPI.
- Không thêm development seed; integration fixture tối thiểu được dọn sau test.

## [0.11.1] - 2026-08-09

### Documentation / Tài liệu

- Audit Prompt 25.5 xác nhận Cart server persistence bị chặn bởi Product server authority, Inventory availability và CustomerProfile ownership mapping chưa tồn tại.
- Thêm `modules/cart/Decision.md`, cập nhật Cart Report và không tuyên bố Cart persistence Complete.

### Notes / Ghi chú

- Không tạo partial migration/API, không hard-code Product/price/stock và không sửa Product/Authentication contract ngoài phạm vi.

## [0.11.0] - 2026-08-09

### Added / Đã thêm

- Thêm Shopping Cart frontend foundation tại `/cart`, protected cho authenticated Customer.
- Thêm actor-scoped transient CartProvider, AddToCartButton, CartSummary, quantity/remove/stock/empty states và Checkout verification gate.
- Tích hợp Cart vào Product Catalog, Product Detail, Customer navigation và thêm 12 Cart tests.

### Notes / Ghi chú

- Cart persistence chưa triển khai vì executable contract còn generic và Product/Inventory/Coupon/Customer persistence dependencies chưa tồn tại.
- Không dùng localStorage/sessionStorage, không fake API/Checkout success và không sửa backend/database/migration/OpenAPI.
- Browser visual verification bị local approval session revoked nên trạng thái visual là BLOCKED.

## [0.10.0] - 2026-08-09

### Added / Đã thêm

- Thêm Wishlist frontend foundation tại `/wishlist`, protected cho authenticated Customer bằng RouteGuard hiện có.
- Thêm memory-only WishlistProvider, accessible WishlistButton, empty/list state và 8 Wishlist tests.
- Tích hợp Wishlist action vào Product Catalog, Product Detail và Customer navigation.

### Notes / Ghi chú

- Wishlist persistence chưa triển khai: executable backend contract còn thiếu typed schemas và Product/Customer persistence dependencies chưa tồn tại.
- Không dùng localStorage/sessionStorage, không fake API success và không sửa backend/database/migration/OpenAPI.
- Browser visual verification bị local approval session revoked nên trạng thái visual là BLOCKED.

## [0.9.0] - 2026-08-09

### Added / Đã thêm

- Thêm `ProductSearch` dùng chung tại Homepage, public header/mobile menu và Product Catalog.
- Thêm autocomplete tối đa 8 kết quả cho text query, product, category, brand và dietary tag; hỗ trợ combobox/listbox và điều hướng bàn phím.
- Thêm Search & Product Discovery tests và tài liệu privacy/URL/filter behavior.

### Changed / Đã cập nhật

- Catalog search dùng chung query normalization, tìm theo name/category/brand/short description/dietary tag và reset page khi search mới.
- No-result state bổ sung đường quay về toàn bộ sản phẩm; Homepage search giữ validation hiện hữu.

### Notes / Ghi chú

- Không lưu recent search vì UI Contract quy định search/filter form không lưu dữ liệu và query có thể nhạy cảm.
- Không sửa backend, Product API, Authentication, database, migration, OpenAPI hay AI runtime.
- Browser visual verification bị local approval session thu hồi nên trạng thái là `Complete — Visual Browser Verification Blocked`.

## [0.8.0] - 2026-08-09

### Added / Đã thêm

- Triển khai Product Detail V1 tại `/products/:slug`, resolve bằng slug từ Product Catalog presentation data.
- Thêm media gallery keyboard-accessible, price/stock/action summary, dietary attributes, nutrition table, ingredients/allergen, description, review/AI foundation và related products.
- Thêm loading, not-found, error/retry states và 12 Product Detail tests.

### Changed / Đã cập nhật

- Mở rộng Product presentation model với typed media, nutrition, ingredients, allergen, storage/use note và long description optional.
- Thay route Product Detail placeholder bằng trang presentation thật; Cart/Wishlist vẫn disabled và không persistence.

### Notes / Ghi chú

- Không triển khai Product backend, Cart/Wishlist persistence, Review API, AI runtime hoặc recommendation engine.
- Browser visual verification tiếp tục bị môi trường phê duyệt cục bộ chặn; không đánh dấu viewport visual là pass.

## [0.7.0] - 2026-08-09

### Added / Đã thêm

- Triển khai Product Catalog V1 tại `/products` với typed Product presentation model và 24 bản ghi catalog presentation tập trung.
- Thêm search, category/brand/price/dietary/availability filter, sort, page size, pagination và active chips đồng bộ URL.
- Thêm desktop filter sidebar, mobile filter Drawer, Product Skeleton, EmptyState, ErrorState/Retry và 12 Catalog tests.

### Changed / Đã cập nhật

- Homepage Featured Products chuyển sang dùng chung Product model/data với Catalog.
- ProductCard hỗ trợ rating/review/stock details mà không thêm Cart hoặc Product business logic.
- Route `/products` thay Product placeholder; `/products/:slug` vẫn là Product Detail foundation.

### Notes / Ghi chú

- Không gọi Product API chưa triển khai; không sửa backend, Authentication, database, migration hoặc OpenAPI.
- Frontend lint/typecheck và 49 tests đạt. Browser visual verification bị môi trường phê duyệt cục bộ chặn và không được tuyên bố pass.

## [0.6.0] - 2026-08-07

### Added / Đã thêm

- Triển khai HealthyHub Homepage V1 theo UI Contract: Hero/search entry, category preview, featured products, value proposition, AI preview, lifestyle, promotion, blog preview và public footer.
- Thêm typed presentation data riêng, public route foundation cho Product/Promotion/Blog/AI và 4 Homepage/navigation/auth-state regression tests.

### Changed / Đã cập nhật

- Public navigation chuyển sang responsive desktop/mobile, bỏ Admin khỏi public header và tiếp tục dùng Authentication context hiện tại.
- Email Verification Banner của Customer chưa xác minh được hiển thị trên public Homepage.
- Mở rộng ProductCard và Button style API trong Shared UI để hỗ trợ Homepage mà không thêm business logic.

### Notes / Ghi chú

- Không gọi endpoint chưa tồn tại; không triển khai Product, Cart, Checkout, Payment, Order hay AI runtime.
- Responsive DOM verification không có horizontal overflow tại 390, 820, 1024 và 1440px.

## [0.5.0] - 2026-08-06

### Added / Đã thêm

- Triển khai Authentication Frontend V1 (Prompt 18): Login/Register/Forgot/Reset/Verify, memory session restore, cookie/CSRF refresh, logout, route guards, role/permission foundation và 18 frontend tests.

- Triển khai Authentication Backend V1 (Prompt 17): NestJS controller/service/DTO/guards, Argon2id, JWT, rotating refresh token, CSRF, RBAC, account lock, audit và unit tests; database integration verification đang bị chặn do MySQL/Docker không khả dụng.

- Thêm Authentication/User identity TypeORM migrations, 9 entities, repository/data-access foundation và RBAC seed.
- Thêm Authentication V1 shared TypeScript contracts và 8 data-layer unit tests.

### Changed / Đã cập nhật

- Chuyển API Vitest config sang `.mts` để tương thích ESM dependency mà không đổi dependency.
- Cập nhật Authentication module sang `Implementation Complete - Database Verification Blocked`.

### Notes / Ghi chú

- API/shared lint, typecheck và build đạt; unit tests đạt.
- Migration MySQL up/down chưa chạy vì Docker daemon không hoạt động.
- Không tạo controller/service nghiệp vụ/endpoint/UI và không sửa `.spec` hoặc OpenAPI.

## [0.4.0] - 2026-08-06

### Added / Đã thêm

- Thêm Authentication Data Contract V1 và dedicated OpenAPI schemas/responses/examples.
- Ghi đầy đủ 10 Approved P0 decision về password, token, session, CSRF/CORS, account protection, RBAC, tenant và retention.

### Changed / Đã cập nhật

- Đồng bộ Authentication API/flow, physical database, UI contracts và OpenAPI 1.1.0.
- Chuyển `modules/authentication` sang `Ready for Implementation` sau khi validation đạt.

### Notes / Ghi chú

- Không viết code, SQL, migration, entity, backend/frontend implementation hoặc secret production.

## [0.3.0] - 2026-08-06

### Added / Đã thêm

- Tạo Implementation Foundation cho Prompt 14.
- Bổ sung root npm workspace có scripts dev, build, lint, format, typecheck, test, OpenAPI validation, docs check, secret check và Docker check.
- Tạo NestJS API foundation trong `apps/api` gồm bootstrap, environment validation, TypeORM config, health check, Swagger/OpenAPI integration, validation pipe, exception filter, response envelope, request ID, trace ID, structured logging, CORS, Helmet, rate-limit foundation và graceful shutdown.
- Tạo gateway contract/base structure cho AI, Payment, Storage, Notification, OCR, Vision, Analytics và Integration trong `apps/api/src/gateways`.
- Tạo React/Vite/Tailwind web foundation trong `apps/web` gồm app shell, router, public/customer/admin layout, route guard foundation, error boundary, loading, empty state, toast và Axios client.
- Tạo shared packages `packages/shared-types`, `packages/shared-utils` và `packages/shared-config`.
- Tạo Dockerfile cho API/Web và cập nhật `docker-compose.yml` để chạy Web, API, MySQL và phpMyAdmin.
- Tạo scripts `scripts/validate-openapi.mjs`, `scripts/check-docs.mjs`, `scripts/check-secrets.mjs` và `scripts/docker-startup-check.mjs`.
- Tạo tài liệu vận hành tại `docs/implementation-foundation`.
- Tạo work summary `docs/work-summaries/2026-08-06-12-prompt-14-implementation-foundation.md`.

### Updated / Đã cập nhật

- Cập nhật `README.md`, `docs/README.md`, `docs/01-folder-structure.md`, `CAU_TRUC_THU_MUC.md`, `TONG_HOP_DA_LAM.md`, `docs/18-framework-inventory.md`, `docs/framework-audit-report.md`, `SECURITY.md`, `docs/development-standards/environment-standard.md`, `docs/development-standards/docker-standard.md`, `apps/api/README.md` và `apps/web/README.md`.
- Cập nhật `.env.*.example` theo cấu hình foundation.
- Cập nhật GitHub Actions để chạy kiểm tra workspace thực tế.
- Cập nhật Vitest lên `4.1.10` và React Router DOM lên `7.18.2` trong phạm vi stack hiện có để giảm kết quả audit.

### Notes / Ghi chú

- Không triển khai module Authentication.
- Không tạo CRUD sản phẩm, đơn hàng, thanh toán hoặc AI nghiệp vụ.
- Không tạo SQL migration hoặc bảng nghiệp vụ.
- Dependency audit đã giảm từ 9 xuống 4 high vulnerabilities; còn cần xử lý tiếp `@nestjs/swagger`/`js-yaml` và React Router advisory range.

## [0.2.0] - 2026-08-06

### Added / Đã thêm

- Tạo Business Blueprint cho Prompt 05 tại `docs/business-blueprint`.
- Bổ sung tài liệu business strategy, target users, business domains, business rules, module map, feature map, AI feature map, user journeys, business flows, permission matrix, acceptance criteria, non-functional requirements và version planning.
- Tạo `docs/business-blueprint/Status.md`, `Report.md`, `Checklist.md` và `ChangeLog.md`.
- Tạo work summary `docs/work-summaries/2026-08-06-01-prompt-05-business-blueprint.md`.
- Tạo Feature Specifications cho Prompt 06 tại `.spec/features`.
- Bổ sung 34 feature spec folders, bao gồm các nhóm Account & User, Catalog, Commerce, Growth, Operations và AI.
- Tạo `.spec/features/Status.md`, `Report.md`, `Checklist.md` và `ChangeLog.md`.
- Tạo work summary `docs/work-summaries/2026-08-06-02-prompt-06-feature-specifications.md`.
- Tạo Domain Model cho Prompt 07 tại `.spec/domain`.
- Bổ sung Domain Overview, Domain Dependency Map, Ubiquitous Language và Business Constraints.
- Bổ sung 23 domain model chi tiết trong `.spec/domain/domains`.
- Tạo `.spec/domain/Status.md`, `Report.md`, `Checklist.md` và `ChangeLog.md`.
- Tạo work summary `docs/work-summaries/2026-08-06-03-prompt-07-domain-model.md`.
- Tạo Logical Database Design cho Prompt 08 tại `.spec/database`.
- Bổ sung Database Standards, Domain Data Map, Cross Domain Relationships, Logical ERD và Data Readiness.
- Bổ sung 23 tài liệu logical database riêng trong `.spec/database/domains`.
- Tạo `.spec/database/Status.md`, `Report.md`, `Checklist.md` và `ChangeLog.md`.
- Tạo work summary `docs/work-summaries/2026-08-06-04-prompt-08-logical-database-design.md`.
- Tạo Physical Database Design cho Prompt 09 tại `.spec/database-physical`.
- Bổ sung Physical Standards, Relationship Rules, Index Catalog, Performance Strategy, Migration Strategy và Backup Recovery.
- Bổ sung 23 tài liệu physical database riêng trong `.spec/database-physical/domains`.
- Tạo `.spec/database-physical/Status.md`, `Report.md`, `Checklist.md` và `ChangeLog.md`.
- Tạo work summary `docs/work-summaries/2026-08-06-05-prompt-09-physical-database-design.md`.
- Tạo Data Contract Specification cho Prompt 09.5 tại `.spec/data-contracts`.
- Bổ sung Contract Standards, Data Format Standards, Request Model, Response Model, API Envelope, Pagination, Filter/Search/Sort, File Transfer, Error Standard, Validation Response, AI Response, Metadata, Enum, Versioning và Domain Contract Map.
- Tạo `.spec/data-contracts/Status.md`, `Report.md`, `Checklist.md` và `ChangeLog.md`.
- Tạo work summary `docs/work-summaries/2026-08-06-06-prompt-09-5-data-contract-specification.md`.
- Tạo API Specification cho Prompt 10 tại `.spec/api`.
- Bổ sung API Conventions, API Security, Authentication Flow, Error Catalog, Domain API Map, Endpoint Matrix, Rate Limit Policy và Webhook Policy.
- Bổ sung 23 tài liệu API theo domain trong `.spec/api/domains`.
- Tạo `.spec/api/Status.md`, `Report.md`, `Checklist.md` và `ChangeLog.md`.
- Tạo work summary `docs/work-summaries/2026-08-06-07-prompt-10-api-specification.md`.
- Tạo UI Contract Specification cho Prompt 11 tại `.spec/ui-contract`.
- Bổ sung UI Contract Standards, Navigation, Screen Flow, Component Mapping và State Contract.
- Bổ sung 32 tài liệu screen contract trong `.spec/ui-contract/screens`.
- Tạo `.spec/ui-contract/Status.md`, `Report.md`, `Checklist.md` và `ChangeLog.md`.
- Tạo work summary `docs/work-summaries/2026-08-06-08-prompt-11-ui-contract-specification.md`.
- Tạo Design System cho Prompt 12 tại `docs/design-system`.
- Bổ sung Design Principles, Design Tokens, Color Palette, Typography, Spacing, Border Radius, Elevation, Shadow, Grid, Breakpoints, Icon Guideline, Illustration Guideline, Motion Guideline, Dark Mode và Accessibility Guideline.
- Bổ sung Component Library, Component Usage Map và 30 component specification trong `docs/design-system/components`.
- Tạo `docs/design-system/Status.md`, `Report.md`, `Checklist.md` và `ChangeLog.md`.
- Tạo work summary `docs/work-summaries/2026-08-06-09-prompt-12-design-system.md`.
- Tạo Development Standards cho Prompt 12.5 tại `docs/development-standards`.
- Bổ sung chuẩn Coding, TypeScript, React, Tailwind, NestJS, MySQL, API implementation, Data Contract implementation, Gateway, folder, naming, import/export, error, logging, validation, security, performance, accessibility, SEO, testing, documentation, environment, Docker, Git, dependency, versioning/release và AI code generation.
- Bổ sung Vertical Slice Workflow, Module Done Definition và template report/checklist/review cho phase implementation.
- Tạo `docs/development-standards/Status.md`, `Report.md`, `Checklist.md` và `ChangeLog.md`.
- Tạo `docs/architecture/adr/ADR-006-backend-framework-nestjs.md` để ghi nhận quyết định chọn NestJS.
- Tạo work summary `docs/work-summaries/2026-08-06-10-prompt-12-5-development-standards.md`.
- Tạo OpenAPI Specification cho Prompt 13 tại `openapi`.
- Bổ sung `openapi/openapi.yaml` theo OpenAPI 3.1 với 194 operation thuộc 23 domain và 167 path item.
- Bổ sung shared schemas, parameters, responses, examples, security schemes và provider webhook contracts cho payment, shipping, notification.
- Tạo `openapi/Status.md`, `Report.md`, `Checklist.md` và `ChangeLog.md`.
- Tạo work summary `docs/work-summaries/2026-08-06-11-prompt-13-openapi-specification.md`.

### Updated / Đã cập nhật

- Cập nhật `README.md`, `docs/README.md`, `docs/01-folder-structure.md` và `CAU_TRUC_THU_MUC.md` để dễ tìm Business Blueprint.
- Cập nhật `.spec/README.md` để ghi rõ Prompt 06 chỉ tạo business feature specification, chưa tạo Database/API/UI.
- Cập nhật `README.md`, `docs/README.md` và `CAU_TRUC_THU_MUC.md` để dễ tìm Feature Specifications.
- Cập nhật `.spec/README.md`, `README.md`, `docs/README.md`, `docs/01-folder-structure.md` và `CAU_TRUC_THU_MUC.md` để dễ tìm Domain Model.
- Cập nhật `docs/work-summaries/README.md` để thêm index file tổng hợp theo từng prompt.
- Cập nhật `.spec/README.md`, `README.md`, `docs/README.md`, `docs/01-folder-structure.md` và `CAU_TRUC_THU_MUC.md` để dễ tìm Logical Database Design.
- Cập nhật `.spec/README.md`, `README.md`, `docs/README.md`, `docs/01-folder-structure.md` và `CAU_TRUC_THU_MUC.md` để dễ tìm Physical Database Design.
- Cập nhật `.spec/README.md`, `README.md`, `docs/README.md`, `docs/01-folder-structure.md`, `CAU_TRUC_THU_MUC.md`, `TONG_HOP_DA_LAM.md` và `docs/18-framework-inventory.md` để dễ tìm Data Contract Specification.
- Cập nhật `.spec/README.md`, `README.md`, `docs/README.md`, `docs/01-folder-structure.md`, `docs/05-api.md`, `docs/api/README.md`, `CAU_TRUC_THU_MUC.md`, `TONG_HOP_DA_LAM.md` và `docs/18-framework-inventory.md` để dễ tìm API Specification.
- Cập nhật `.spec/README.md`, `README.md`, `docs/README.md`, `docs/01-folder-structure.md`, `docs/06-ui-ux.md`, `CAU_TRUC_THU_MUC.md`, `TONG_HOP_DA_LAM.md` và `docs/18-framework-inventory.md` để dễ tìm UI Contract Specification.
- Cập nhật `README.md`, `docs/README.md`, `docs/01-folder-structure.md`, `docs/06-ui-ux.md`, `design/README.md`, `CAU_TRUC_THU_MUC.md`, `TONG_HOP_DA_LAM.md` và `docs/18-framework-inventory.md` để dễ tìm Design System.
- Cập nhật `README.md`, `docs/README.md`, `docs/01-folder-structure.md`, `docs/00-project-rules.md`, `.ai/context/technology-stack.md`, `docs/foundation/project/project-overview.md`, `docs/architecture/adr/README.md`, `CAU_TRUC_THU_MUC.md`, `TONG_HOP_DA_LAM.md` và `docs/18-framework-inventory.md` để dễ tìm Development Standards và khóa backend stack là NestJS.
- Cập nhật `docs/18-framework-inventory.md` để bổ sung hệ thống `.spec` hiện tại.
- Cập nhật `README.md`, `docs/README.md`, `docs/01-folder-structure.md`, `docs/api/README.md`, `docs/api/openapi/README.md`, `CAU_TRUC_THU_MUC.md`, `TONG_HOP_DA_LAM.md` và `docs/18-framework-inventory.md` để dễ tìm OpenAPI Specification chính thức.

### Notes / Ghi chú

- Không viết code nghiệp vụ, không tạo backend/frontend, không viết SQL/migration, không tạo controller/service/DTO code và không tạo UI triển khai.

## [0.1.0] - 2026-08-05

### Added / Đã thêm

- Khởi tạo AI Development Framework cho HealthyHub.
- Tạo cấu trúc thư mục chuẩn cho frontend, backend, database, docs, AI system, deployment, monitoring, security, scripts và templates.
- Tạo bộ tài liệu nền tảng cho Project Rules, Architecture, Database, API, UI/UX, Frontend, Backend, Security, Performance, Testing, Deployment và AI.
- Tạo hệ thống AI skills, rules, prompts, context và module template.
- Tạo `docker-compose.yml` cho MySQL và phpMyAdmin ở mức hạ tầng phát triển.
- Tạo `CAU_TRUC_THU_MUC.md` bản tiếng Việt dễ tra cứu cấu trúc thư mục và ý nghĩa file.
- Bổ sung cây thư mục có comment tiếng Việt trong `CAU_TRUC_THU_MUC.md`.
- Bổ sung AI Development OS Audit & Enhancement Version 1.0.
- Tạo GitHub workflows, issue template và pull request template.
- Tạo environment examples cho development, test và production.
- Tạo backup, storage, logs, audit, knowledge, modules, planning, design system và mobile placeholder.
- Tạo ADR templates cho database, AI provider, storage và architecture decision.
- Bổ sung security policies, AI workflow rule, prompt standard, context management, token optimization guideline và AI review checklist.
- Tạo `docs/framework-audit-report.md`.
- Tạo và mở rộng `TONG_HOP_DA_LAM.md` để tổng hợp toàn bộ framework hiện tại, gồm cả danh sách thư mục và file đầy đủ.
- Bổ sung Framework Enhancement Phase 2: workspace management, assets, email/notification templates, i18n, OpenAPI, API collections, ERD, UI prototype, AI memory/personas/context packs/examples, research, SEO, analytics, legal, business documents, release folder và `.spec`.
- Tạo `docs/framework-phase-2-enhancement-report.md`.
- Tạo bộ Foundation Documentation cho Prompt 03 tại `docs/foundation`.
- Bổ sung tài liệu nền cho Project, Architecture, Standards, Development, Security, Performance, Testing, Deployment, AI và Decision Record.
- Cập nhật `README.md` để thêm đường dẫn vào Foundation Documentation.
- Cập nhật `docs/README.md` để đưa Foundation Documentation vào thứ tự đọc.
- Tạo `docs/work-summaries` để gom file tổng hợp sau mỗi lần làm.
- Thêm quy tắc bắt buộc tạo work summary trong `docs/00-project-rules.md` và `.ai/rules/00-agent-mandatory-rules.md`.
- Hoàn thiện AI Development Core cho Prompt 04 trong `.ai`.
- Bổ sung workflows, checklists, validators, reviewers, registry, knowledge và agents.
- Bổ sung role skills, framework prompts, core context packs, framework templates và memory history.
- Cập nhật AI Index, AI Status, AI Report, AI Checklist và AI ChangeLog.
- Cập nhật cấu trúc thư mục trong `docs/01-folder-structure.md` và `CAU_TRUC_THU_MUC.md`.
- Tạo work summary `docs/work-summaries/2026-08-05-03-prompt-04-ai-development-core.md`.
