# Component Library / Thư viện component

## Purpose / Mục tiêu

Component Library vừa là specification vừa có React/Tailwind foundation tại `apps/web/src/components`. Component chỉ chứa presentation/interaction phổ quát, không chứa nghiệp vụ.

## Component Groups / Nhóm component

| Group / Nhóm | Components / Component |
| --- | --- |
| Action | Button, Toast, Alert, Modal, Drawer. |
| Form | Input, Textarea, Select, Checkbox, Radio, Switch. |
| Data Display | Badge, Tag, Card, Table, Pagination, Tabs, Breadcrumb. |
| Layout | Sidebar, Navbar, Footer, Grid-related layout rules. |
| Feedback | Skeleton, Empty State, Loading. |
| Commerce | Product Card, Search Box, Filter Panel, Calendar for scheduling/promotion. |
| AI | AI Chat Box, AI output state, source/confidence/safety pattern. |
| Analytics | Chart, dashboard metric display. |

## Prompt 19 Implemented Catalog / Catalog đã triển khai

- `ui`: Button, IconButton.
- `forms`: Label, FormField, FieldError, Input, PasswordInput, Textarea, Select, Checkbox, Radio, Switch, SearchInput.
- `feedback`: Spinner, Skeleton, Progress, Alert, EmptyState, ErrorState, SuccessState, Toast foundation.
- `data-display`: Divider, Badge, StatusBadge, Avatar, Card, StatCard, ProductCard UI-only, Pagination, Tabs, Accordion, Tooltip.
- `overlays`: Modal, ConfirmDialog, Drawer.
- `navigation`: Breadcrumb; layout navigation hiện hữu tiếp tục dùng route/link hiện tại.

## Component Requirement / Yêu cầu component

Mỗi component trong [components](components/README.md) phải có:

- Purpose.
- Variant.
- Size.
- State.
- Accessibility.
- Responsive Rule.
- Usage.
- Do.
- Don't.

## Shared Behavior / Hành vi dùng chung

- Component nhận label tiếng Việt ở phase frontend.
- Component không phụ thuộc database field name.
- Component dùng data contract và UI contract để biết dữ liệu.
- Component async phải có loading, empty, error và success rule nếu phù hợp.
- Component nhạy cảm phải có confirmation hoặc warning theo UI State Contract.
