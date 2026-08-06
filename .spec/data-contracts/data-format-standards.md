# Data Format Standards / Chuẩn định dạng dữ liệu

## Purpose / Mục tiêu

Tài liệu này chuẩn hóa cách biểu diễn dữ liệu trong Data Contract để backend, frontend, mobile và AI hiểu cùng một kiểu dữ liệu.

## General Rule / Quy tắc chung

- Contract không trả trực tiếp kiểu dữ liệu MySQL.
- Contract ưu tiên kiểu dễ parse, ổn định và an toàn qua JSON transport ở bước API sau.
- Giá trị cần độ chính xác cao không phụ thuộc vào floating point của JavaScript.
- Field optional và nullable phải được mô tả rõ trong từng contract.

## DateTime Format / Định dạng ngày giờ

| Item / Thành phần | Contract Format / Định dạng contract | Rule / Quy tắc |
| --- | --- | --- |
| Timestamp | ISO 8601 UTC có millisecond | Dùng cho `createdAt`, `updatedAt`, `paidAt`, `expiresAt`. |
| Date only | ISO date | Dùng cho ngày sinh, ngày áp dụng hoặc ngày báo cáo không cần giờ. |
| Time only | 24-hour time | Chỉ dùng khi có nghiệp vụ giờ trong ngày. |
| Time range | `startAt` và `endAt` | Không dùng chuỗi gộp nhiều ý nghĩa. |

Ví dụ định dạng timestamp hợp lệ: `2026-08-06T10:30:00.000Z`.

## Timezone / Múi giờ

| Context / Ngữ cảnh | Rule / Quy tắc |
| --- | --- |
| Storage | Backend lưu timestamp theo UTC. |
| Contract response | Response trả timestamp theo UTC. |
| Client display | Frontend/mobile chuyển đổi theo timezone người dùng. |
| Request metadata | Client gửi timezone dạng IANA khi cần, ví dụ `Asia/Ho_Chi_Minh`. |
| Business date | Ngày nghiệp vụ cần ghi rõ timezone tính toán trong metadata nếu phụ thuộc cửa hàng. |

## Number Format / Định dạng số

| Type / Loại | Contract Type / Kiểu contract | Rule / Quy tắc |
| --- | --- | --- |
| ID | Positive Integer | Không âm, không dùng số thập phân. |
| Quantity | Integer | Không âm trừ khi nghiệp vụ cho phép điều chỉnh tồn kho âm trong audit riêng. |
| Count | Integer | Không âm. |
| Percentage | DecimalString | Scale tối đa 2 cho phần trăm hiển thị. |
| Confidence score | DecimalString | Scale 4, giá trị từ `0.0000` đến `1.0000`. |
| Metric value | DecimalString | Scale tùy metric, mặc định 4. |

## Currency Format / Định dạng tiền tệ

| Item / Thành phần | Rule / Quy tắc |
| --- | --- |
| Amount | Dùng DecimalString cố định 2 chữ số sau dấu thập phân. |
| Currency code | Dùng mã ISO 4217, mặc định `VND` cho HealthyHub nếu chưa cấu hình khác. |
| Display text | Không lưu vào contract nghiệp vụ, frontend tự format theo locale. |
| Discount | Tách rõ `discountAmount`, `discountRate` và `discountType`. |
| Total | Tách subtotal, shipping fee, discount, tax nếu có và grand total. |

## Decimal Precision / Độ chính xác thập phân

| Use Case / Trường hợp | Precision Rule / Quy tắc |
| --- | --- |
| Money | Scale 2, phù hợp physical design `DECIMAL(12,2)`. |
| Percent | Scale 2, phù hợp physical design `DECIMAL(5,2)`. |
| AI confidence | Scale 4, phù hợp physical design `DECIMAL(5,4)`. |
| Analytics metric | Scale 4, phù hợp physical design `DECIMAL(18,4)`. |
| Nutrition value | Scale 2 nếu hiển thị cho người dùng, scale 4 nếu dùng tính toán nội bộ. |

## Boolean Convention / Quy ước boolean

- Contract chỉ dùng true hoặc false.
- Không dùng 0/1, yes/no hoặc chuỗi thay thế boolean.
- Field boolean phải bắt đầu bằng `is`, `has`, `can`, `allow` hoặc `should`.
- Nếu chưa xác định được trạng thái true/false, dùng field status thay vì boolean nullable.

## Null Convention / Quy ước null

| Situation / Tình huống | Rule / Quy tắc |
| --- | --- |
| Field optional không được gửi trong request | Có thể omit nếu contract cho phép. |
| Field có ý nghĩa là chưa biết hoặc chưa xảy ra | Dùng null. |
| Field không áp dụng cho resource | Nên omit hoặc tách model, tránh null hàng loạt. |
| Field bị ẩn do quyền | Không trả field, hoặc trả metadata quyền nếu cần giải thích. |
| Empty text | Dùng chuỗi rỗng chỉ khi người dùng thật sự nhập rỗng và nghiệp vụ cho phép. |

## Empty Collection Convention / Quy ước danh sách rỗng

- Danh sách rỗng trả empty collection, không trả null.
- Pagination list rỗng vẫn phải có metadata phân trang.
- Relationship list chưa được include thì không trả field relationship, tránh hiểu nhầm là không có dữ liệu.

## File URL Convention / Quy ước file URL

| Field / Trường | Meaning / Ý nghĩa | Rule / Quy tắc |
| --- | --- | --- |
| `fileUrl` | URL truy cập file | Không trả local path hoặc storage path nội bộ. |
| `publicUrl` | URL public không cần ký | Chỉ dùng cho asset được phép public. |
| `signedUrl` | URL tạm thời có hạn | Dùng cho file private hoặc cần kiểm soát quyền. |
| `expiresAt` | Thời điểm hết hạn URL | Bắt buộc với signed URL. |
| `storageKey` | Khóa lưu trữ nội bộ | Không trả public, chỉ trả trong admin/storage contract có quyền. |

## Image URL Convention / Quy ước image URL

| Field / Trường | Meaning / Ý nghĩa |
| --- | --- |
| `imageUrl` | Ảnh chính dùng hiển thị nhanh. |
| `thumbnailUrl` | Ảnh nhỏ cho list/card. |
| `previewUrl` | Ảnh preview trong admin hoặc upload flow. |
| `altText` | Văn bản thay thế cho accessibility và SEO. |
| `width` / `height` | Kích thước pixel nếu đã biết. |

## Locale Convention / Quy ước ngôn ngữ

- Giao diện mặc định tiếng Việt.
- Contract hỗ trợ `locale` trong metadata, giá trị chính là `vi-VN` và `en-US`.
- Nội dung dịch không nhồi chung vào một field nếu tính năng cần quản lý đa ngôn ngữ lâu dài.

