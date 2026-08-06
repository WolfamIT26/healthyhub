# UI Contract Standards / Chuẩn UI Contract

## Purpose / Mục tiêu

Tài liệu này chuẩn hóa cách mô tả màn hình để Design System và Frontend Development có thể dùng lại mà không cần suy đoán từ API hoặc nghiệp vụ.

## UI Contract Principle / Nguyên tắc UI Contract

| Principle / Nguyên tắc | Rule / Quy tắc |
| --- | --- |
| Contract-first | Màn hình phải biết route, quyền, API, dữ liệu, state và hành vi trước khi thiết kế giao diện đẹp. |
| Vietnamese UI | Text hiển thị cho người dùng dùng tiếng Việt. |
| API-aligned | Required API phải tham chiếu API Specification, không tự tạo endpoint mới. |
| Contract-aligned | Required Data phải dùng Data Contract, không dùng tên cột database trực tiếp. |
| Role-aware | Mỗi màn hình phải ghi rõ role/permission được xem hoặc thao tác. |
| State-complete | Mỗi màn hình có loading, empty, error, success, confirmation, toast và skeleton khi phù hợp. |
| Responsive-ready | Mỗi màn hình mô tả hành vi desktop, tablet và mobile ở mức contract. |
| Accessible by default | Form có label, trạng thái không chỉ dựa vào màu, thao tác chính có mô tả rõ. |

## Screen Contract Sections / Mục bắt buộc của màn hình

Mỗi screen document trong `screens/` phải có:

- Screen Overview.
- Business Goal.
- Route.
- Permission.
- Required API.
- Required Data.
- UI Sections.
- Components.
- Form.
- Validation.
- Search.
- Filter.
- Sort.
- Pagination.
- Upload.
- Download.
- Loading State.
- Empty State.
- Error State.
- Success State.
- Confirmation Dialog.
- Toast Message.
- Skeleton.
- Responsive Behavior.
- Accessibility.
- SEO Metadata nếu có.

## Route Convention / Quy ước route frontend

| Area / Khu vực | Route Pattern / Mẫu route |
| --- | --- |
| Public | `/`, `/products`, `/products/:productId`, `/blog`, `/blog/:postId` |
| Authentication | `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password` |
| Customer | `/cart`, `/checkout`, `/account`, `/account/orders`, `/account/orders/:orderId` |
| Admin | `/admin`, `/admin/products`, `/admin/orders`, `/admin/settings` |
| AI | `/ai`, `/admin/ai` |

## Data Display Rule / Quy tắc hiển thị dữ liệu

- Tiền tệ hiển thị theo locale Việt Nam, dữ liệu nguồn theo DecimalString.
- Ngày giờ hiển thị theo timezone người dùng, dữ liệu nguồn theo UTC ISO 8601.
- Enum hiển thị bằng label tiếng Việt, không hiển thị raw enum nếu không dành cho admin kỹ thuật.
- Dữ liệu cá nhân như email, phone, address phải masking khi user không đủ quyền.
- AI output cần hiển thị confidence/safety khi có rủi ro hoặc khi dùng trong admin review.

## Form Rule / Quy tắc form

- Field required phải có label và trạng thái lỗi.
- Submit button disabled khi form chưa hợp lệ hoặc đang submit.
- Validation frontend chỉ hỗ trợ trải nghiệm, backend vẫn là nguồn quyết định.
- Validation error mapping theo [Validation Response](../data-contracts/validation-response.md).
- Hành động nhạy cảm cần confirmation dialog và reason nếu API yêu cầu.

## List Rule / Quy tắc danh sách

- Danh sách lớn phải có pagination.
- Search/filter/sort chỉ dùng field được API Specification cho phép.
- Empty state phải nêu rõ vì chưa có dữ liệu hay vì filter/search không có kết quả.
- Bulk action chỉ hiển thị khi permission cho phép.

## AI UI Rule / Quy tắc UI cho AI

- AI answer không được trình bày như quyết định tuyệt đối.
- Nutrition AI cần disclaimer.
- AI marketing output cần trạng thái cần duyệt trước khi publish/send.
- AI response có safety blocked phải hiển thị lý do an toàn ở mức thân thiện, không lộ policy nội bộ.

