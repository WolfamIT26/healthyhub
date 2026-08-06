# Pagination Contract / Chuẩn phân trang

## Purpose / Mục tiêu

Tài liệu này chuẩn hóa phân trang cho các danh sách sản phẩm, đơn hàng, khách hàng, tồn kho, bài viết, review, notification, analytics và log AI.

## Pagination Principle / Nguyên tắc phân trang

- Mọi list có khả năng lớn phải phân trang.
- Không trả danh sách không giới hạn.
- Page size phải có giới hạn tối đa để bảo vệ hiệu năng.
- Response list phải có metadata để frontend/mobile render phân trang ổn định.

## Page Pagination / Phân trang theo trang

| Field / Trường | Direction / Hướng | Rule / Quy tắc |
| --- | --- | --- |
| `page` | Request | Số trang bắt đầu từ 1. |
| `pageSize` | Request | Số item mỗi trang, mặc định theo từng resource. |
| `totalItems` | Response | Tổng số item sau filter nếu hệ thống tính được. |
| `totalPages` | Response | Tổng số trang nếu có `totalItems`. |
| `hasNext` | Response | Có trang tiếp theo hay không. |
| `hasPrevious` | Response | Có trang trước hay không. |
| `items` | Response | Collection dữ liệu của trang hiện tại. |

## Limit Rule / Quy tắc giới hạn

| Use Case / Trường hợp | Default Page Size / Mặc định | Max Page Size / Tối đa |
| --- | --- | --- |
| Public product list | 20 | 60 |
| Admin management list | 20 | 100 |
| Order/customer list | 20 | 100 |
| Notification list | 20 | 100 |
| Audit/log list | 50 | 200 |
| Analytics aggregate list | 50 | 200 |
| AI history list | 20 | 100 |

## Cursor Pagination / Phân trang cursor

Cursor pagination được chuẩn bị cho các danh sách lớn hoặc stream-like:

- Audit log.
- AI interaction history.
- Notification.
- Analytics event.
- Activity feed.

Cursor contract gồm:

| Field / Trường | Direction / Hướng | Meaning / Ý nghĩa |
| --- | --- | --- |
| `cursor` | Request | Vị trí bắt đầu đọc tiếp. |
| `limit` | Request | Số item muốn lấy. |
| `nextCursor` | Response | Cursor để lấy trang tiếp theo. |
| `hasNext` | Response | Còn dữ liệu tiếp theo hay không. |

## Sorting Stability / Độ ổn định khi phân trang

- List phân trang phải có sort ổn định.
- Nếu sort theo field có thể trùng như `createdAt`, cần bổ sung ID làm tie-breaker ở bước query design.
- Cursor không được chứa dữ liệu nhạy cảm nếu trả về client.
- Cursor nên là token opaque ở bước API sau, client không tự parse.

## Empty Page Rule / Quy tắc trang rỗng

- Nếu không có item, trả `items` rỗng và pagination metadata hợp lệ.
- Nếu page vượt quá `totalPages`, API sau này có thể trả trang rỗng hoặc lỗi validation tùy resource, nhưng phải ghi rõ trong API spec.
- Không dùng null cho `items`.

## Performance Rule / Quy tắc hiệu năng

- List public sản phẩm phải ưu tiên index theo category, status, price, stock và sort phổ biến.
- List admin phải có filter rõ để tránh full scan lớn.
- Audit/log/analytics nên ưu tiên cursor pagination khi dữ liệu tăng nhanh.
- Pagination metadata đắt đỏ như `totalItems` có thể được cấu hình optional cho dữ liệu rất lớn.

