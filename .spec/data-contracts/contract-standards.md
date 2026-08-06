# Contract Standards / Tiêu chuẩn Data Contract

## Purpose / Mục tiêu

Tài liệu này định nghĩa các quy tắc nền để mọi Data Contract trong HealthyHub nhất quán, dễ dùng lại và sẵn sàng cho web, mobile, AI và microservice trong tương lai.

## Contract Principle / Nguyên tắc contract

| Principle / Nguyên tắc | Rule / Quy tắc |
| --- | --- |
| Stable Boundary | Contract là biên ổn định giữa client, backend, mobile và AI, không phụ thuộc trực tiếp vào tên cột database. |
| Public Safety | Contract public không trả dữ liệu nhạy cảm như password hash, token, secret, raw provider credential hoặc thông tin nội bộ không cần thiết. |
| Explicit Shape | Request và response phải có cấu trúc rõ, không dùng field mơ hồ như `data1`, `info`, `misc` hoặc `temp`. |
| Additive Change | Thay đổi contract ưu tiên thêm field mới, không đổi nghĩa field cũ. |
| Domain Ownership | Field thuộc domain nào phải theo ngôn ngữ domain đó và không làm lẫn quyền sở hữu dữ liệu. |
| AI Traceability | Contract liên quan AI phải có metadata đủ để audit, giải thích nguồn dữ liệu và theo dõi tương tác. |
| Mobile Readiness | Contract phải đủ ổn định để mobile app dùng lại khi phát triển sau. |
| SaaS Readiness | Contract tenant-scoped phải chuẩn bị `tenantId` ở metadata hoặc resource scope khi cần. |

## Naming Convention / Quy ước đặt tên

| Item / Thành phần | Convention / Quy ước | Note / Ghi chú |
| --- | --- | --- |
| Public field | `camelCase` | Dùng cho request, response và metadata. |
| Database field | `snake_case` | Chỉ xuất hiện trong database docs, không lộ trực tiếp ra contract public. |
| Enum value | `lower_snake_case` | Ổn định cho backend, frontend, mobile và AI. |
| Resource ID field | `<resourceName>Id` | Ví dụ: `productId`, `orderId`, `customerId`. |
| Display text field | `displayName`, `title`, `label` | Tùy mục đích hiển thị, không dùng lẫn nghĩa. |
| Boolean field | `is`, `has`, `can`, `allow`, `should` | Tên phải thể hiện rõ true/false. |
| Timestamp field | Kết thúc bằng `At` | Ví dụ: `createdAt`, `paidAt`, `expiresAt`. |
| Count field | Kết thúc bằng `Count` | Ví dụ: `reviewCount`, `itemCount`. |
| Amount field | Kết thúc bằng `Amount` hoặc `Total` | Giá trị tiền dùng DecimalString. |

## DTO Convention / Quy ước DTO ở mức tài liệu

| DTO Group / Nhóm DTO | Purpose / Mục tiêu | Rule / Quy tắc |
| --- | --- | --- |
| Command Input | Dữ liệu tạo/sửa/thực hiện hành động | Chỉ chứa field client được phép gửi. |
| Query Input | Dữ liệu tìm kiếm/danh sách | Dùng pagination, filter, search và sort contract. |
| Detail Output | Dữ liệu chi tiết một resource | Có thể nhiều field hơn list output nhưng không lộ dữ liệu nhạy cảm. |
| List Output | Dữ liệu hiển thị danh sách | Gọn, có field đủ để render list và action phổ biến. |
| Option Output | Dữ liệu cho dropdown/filter | Nhẹ, thường gồm ID, label, status và metadata cần thiết. |
| Admin Output | Dữ liệu quản trị | Có thể có audit field và flag nội bộ nhưng vẫn không trả secret. |
| AI Output | Dữ liệu do AI tạo hoặc phân tích | Bắt buộc có confidence, source policy và human review flag khi phù hợp. |

## Field Exposure Rule / Quy tắc lộ field

| Field Type / Loại field | Public Contract / Contract public | Admin Contract / Contract admin |
| --- | --- | --- |
| Internal primary key | Có thể dùng nếu chưa có public identifier riêng | Có thể dùng |
| Password hash | Không bao giờ trả | Không bao giờ trả |
| Access token raw | Chỉ trả ở contract xác thực chuyên trách nếu được thiết kế riêng | Không log, không trả trong list/detail |
| Refresh token raw | Không trả trong resource response | Không trả trong list/detail |
| Payment provider secret | Không trả | Không trả |
| Audit timestamps | Trả khi hữu ích | Trả đầy đủ hơn |
| Actor audit fields | Hạn chế | Có thể trả dạng summary |
| Soft delete fields | Không trả public | Có thể trả trong admin/audit view |
| AI prompt raw | Không trả public | Chỉ trả trong audit có quyền đặc biệt và đã masking |

## ID Contract Rule / Quy tắc ID

- Contract dùng ID theo dạng số nguyên dương khi phản ánh resource nội bộ hiện tại.
- Public identifier riêng có thể được thêm ở phiên bản sau nếu cần chia sẻ link công khai, mobile deep link hoặc tích hợp bên ngoài.
- Client không được tự tạo ID cho resource nghiệp vụ chính.
- ID phải có tên rõ theo resource, không dùng field chung chung `id` trong request liên domain nếu gây mơ hồ.
- Response chi tiết một resource có thể dùng `id` nếu resource type đã rõ trong context response.

## Privacy Rule / Quy tắc riêng tư

- Dữ liệu cá nhân chỉ trả theo đúng quyền truy cập.
- Dữ liệu khách hàng trong order, shipping, payment cần ưu tiên snapshot cần thiết, không trả quá nhiều thông tin account.
- AI contract không được trả thông tin nhạy cảm trong nguồn tham chiếu nếu user không có quyền xem dữ liệu gốc.
- Log, audit và analytics chỉ trả dữ liệu tổng hợp hoặc đã masking khi dùng ở dashboard không chuyên trách.

## Compatibility Rule / Quy tắc tương thích

- Thêm field optional được xem là thay đổi tương thích.
- Đổi tên field, đổi kiểu dữ liệu, đổi nghĩa enum hoặc bỏ field là breaking change.
- Mọi breaking change phải qua versioning rule trong [Versioning](versioning.md).

