# Component Mapping / Mapping component

## Purpose / Mục tiêu

Tài liệu này mapping nhóm component logic với các màn hình. Đây không phải implementation component và không quyết định style.

## Common Component Groups / Nhóm component dùng chung

| Component Group / Nhóm component | Usage / Cách dùng |
| --- | --- |
| App Shell | Header, navigation, account menu, admin sidebar, main content region. |
| Data List | Table, card list, grid list, pagination, filter bar, search input, sort control. |
| Data Detail | Detail header, summary panel, timeline, status badge, metadata section. |
| Form | Field group, text input, select, textarea, checkbox/toggle, submit action. |
| Feedback | Loading, skeleton, empty state, error state, toast, confirmation dialog. |
| Commerce | Product card, product media gallery, price summary, cart item, checkout summary. |
| Admin Operation | Status action bar, audit summary, reason dialog, bulk action bar. |
| AI | Chat panel, source list, confidence badge, safety notice, human review panel. |
| Media | Upload panel, media grid, preview panel, download action. |
| Analytics | Metric card, chart placeholder contract, date range filter, export action. |

## Screen to Component Map / Mapping màn hình với component

| Screen / Màn hình | Component Groups / Nhóm component |
| --- | --- |
| Home | App Shell, Product Card, Promotion Strip, Blog Card, AI Entry |
| Product List | App Shell, Filter Bar, Search Input, Sort Control, Product Grid, Pagination |
| Product Detail | App Shell, Media Gallery, Product Summary, Ingredient Section, Review Summary, AI Entry |
| Blog List | App Shell, Blog Card, Search Input, Pagination |
| Blog Detail | App Shell, Content Detail, Related Product List, SEO Metadata |
| Auth Screens | Auth Form, Validation Message, Toast, Loading Button |
| Cart | Cart Item List, Price Summary, Coupon Form, Confirmation Dialog |
| Checkout | Checkout Form, Address Selector, Shipping Quote, Payment Method, Order Summary |
| Customer Account | Profile Form, Address List, Order Summary, Notification List |
| Admin Dashboard | Admin Shell, Metric Card, Alert List, Task List |
| Admin Products | Admin Shell, Data Table, Filter Bar, Product Form, Upload Link, Status Action |
| Admin Orders | Admin Shell, Data Table, Order Detail, Timeline, Status Action, Reason Dialog |
| Admin Analytics | Admin Shell, Metric Card, Chart Placeholder, Date Range Filter, Export Action |
| Admin AI | Admin Shell, AI Prompt Panel, AI Output Review, Source List, Safety Notice |

## Component Rule / Quy tắc component

- Component name ở tài liệu dùng tiếng Anh, UI label dùng tiếng Việt khi triển khai.
- Component không được phụ thuộc vào database field name.
- Component nhận dữ liệu từ API contract hoặc state nội bộ đã mô tả.
- Component có loading, empty và error behavior nếu nhận dữ liệu async.

