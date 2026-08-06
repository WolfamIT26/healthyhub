# React Style Guide / Chuẩn React

## Purpose / Mục tiêu

React trong HealthyHub dùng để xây dựng Web app theo feature/module, bám UI Contract và Design System. Component không được chứa business logic phức tạp hoặc gọi provider bên ngoài trực tiếp.

## Folder Role / Vai trò thư mục

| Folder / Thư mục | Responsibility / Trách nhiệm |
| --- | --- |
| `apps/web/src/pages` | Page theo route, kết nối UI Contract với module/component. |
| `apps/web/src/modules` | UI và logic theo feature/module nghiệp vụ. |
| `apps/web/src/components` | Component dùng chung bám Design System. |
| `apps/web/src/routes` | Định nghĩa route và guard frontend. |
| `apps/web/src/services` | Lớp gọi API theo Data Contract. |
| `apps/web/src/shared` | Type, helper, constant kỹ thuật dùng chung. |
| `apps/web/src/styles` | Global style/Tailwind setup ở phase implementation. |

## Component Rule / Quy tắc component

- Component dùng chung không biết business rule chi tiết.
- Component nghiệp vụ nằm trong module liên quan.
- Component chỉ gọi service/hook đã chuẩn hóa, không gọi provider bên ngoài trực tiếp.
- Component phải có loading, skeleton, empty, error và success state khi nhận dữ liệu async.
- Component public phải hỗ trợ responsive và accessibility theo Design System.

## State Management / Quản lý state

- Local state dùng cho UI state ngắn như modal open, selected tab, form draft.
- Shared state chỉ dùng khi nhiều màn hình/module thật sự cần.
- Server state phải được đồng bộ qua service/data fetching layer, không copy tràn lan.
- Không lưu token hoặc dữ liệu nhạy cảm trong state không an toàn.

## Form Rule / Quy tắc form

- Form validation frontend bám Validation Standard và Data Contract.
- Backend vẫn là nguồn quyết định cuối cùng.
- Validation error từ API phải map đúng field.
- Submit phải có loading và disabled state.

## API Rule / Quy tắc gọi API

- Không gọi API trực tiếp rải rác trong component nếu đã có service layer.
- Request/response phải bám Data Contract.
- Error phải map theo Error Handling Standard.
- Search cần debounce khi phù hợp.

## SEO Accessibility Responsive / SEO, accessibility, responsive

- Màn hình public phải bám SEO Standard.
- UI text dùng tiếng Việt.
- Button, form, modal, drawer và navigation phải có accessibility rule.
- Mobile, tablet và desktop phải tuân thủ UI Contract và Design System.

