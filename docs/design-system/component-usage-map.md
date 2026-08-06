# Component Usage Map / Mapping cách dùng component

## Purpose / Mục tiêu

Tài liệu này mapping component Design System với các nhóm màn hình từ UI Contract để Frontend Agent chọn đúng component khi triển khai sau này.

## Screen Group Mapping / Mapping nhóm màn hình

| Screen Group / Nhóm màn hình | Main Components / Component chính |
| --- | --- |
| Public Storefront | Navbar, Footer, Product Card, Search Box, Filter Panel, Card, Badge, Tag, Skeleton, Empty State. |
| Product Detail | Product Card pattern, Button, Badge, Tag, Tabs, Alert, AI Chat Box entry, Skeleton. |
| Blog | Navbar, Footer, Card, Breadcrumb, Tag, Pagination, Empty State. |
| Authentication | Input, Button, Alert, Toast, Loading, Card or form surface. |
| Cart | Button, Input, Badge, Alert, Modal, Empty State, Loading. |
| Checkout | Input, Select, Radio, Checkbox, Button, Alert, Modal, Loading, Toast. |
| Customer Account | Tabs, Input, Select, Table or list, Badge, Pagination, Toast, Modal. |
| Admin Dashboard | Sidebar, Navbar, Card, Badge, Table, Chart, Alert, Skeleton. |
| Admin Management | Sidebar, Table, Filter Panel, Search Box, Pagination, Drawer, Modal, Toast, Alert. |
| Admin AI | AI Chat Box, Textarea, Select, Button, Badge, Alert, Table, Drawer. |
| Analytics | Chart, Card, Select, Calendar, Table, Pagination, Loading. |

## Priority Rule / Quy tắc ưu tiên

- Màn hình customer ưu tiên sự dễ hiểu và hành động mua hàng.
- Màn hình admin ưu tiên tốc độ quét dữ liệu và thao tác an toàn.
- AI component ưu tiên minh bạch nguồn và mức tin cậy.
- Mobile viewport ưu tiên search, CTA chính và nội dung đang xem.

