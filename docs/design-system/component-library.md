# Component Library / Thư viện component

## Purpose / Mục tiêu

Component Library mô tả các component chuẩn của HealthyHub ở mức tài liệu. Đây không phải React component, không phải CSS và không phải UI final.

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

