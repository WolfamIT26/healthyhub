# AI Search Feature Specification / Đặc tả tính năng AI Search

## Metadata / Thông tin

| Field / Trường | Value / Giá trị |
| --- | --- |
| Priority | Version 1.5 |
| Dependency | Products, Categories, Brands, AI Gateway |
| Version | Version 1.5 |
| Owner | Product Owner, AI Engineer |
| Status | Draft for business specification |

## Overview / Tổng quan

AI Search giúp hiểu ý định tìm kiếm tự nhiên của khách và gợi ý sản phẩm phù hợp dựa trên catalog hợp lệ.

## Business Goal / Mục tiêu kinh doanh

Giúp khách tìm sản phẩm healthy bằng ngôn ngữ đời thường, giảm bỏ cuộc khi không biết tên sản phẩm chính xác.

## Scope / Phạm vi

Trong phạm vi: hiểu từ khóa tự nhiên, gợi ý sản phẩm/category/brand liên quan, sửa lỗi tìm kiếm cơ bản. Ngoài phạm vi: search engine implementation, API search, UI search.

## Requirement / Yêu cầu

- AI Search chỉ trả kết quả từ sản phẩm public.
- Query ngoài phạm vi cần fallback.
- Kết quả phải tôn trọng trạng thái bán.
- Search không được bịa sản phẩm.

## User Story / User story

- Là Guest, tôi muốn tìm bằng câu như "sữa hạt ít đường".
- Là Customer, tôi muốn tìm sản phẩm theo nhu cầu healthy.
- Là Manager, tôi muốn search ưu tiên sản phẩm hợp lệ.

## Use Case / Use case

| Use Case | Actor | Result |
| --- | --- | --- |
| Natural language search | Guest, Customer | Có kết quả liên quan. |
| Suggest category | Guest, Customer | Người dùng được gợi ý nhóm phù hợp. |
| No result fallback | Guest, Customer | Nhận hướng dẫn tìm lại. |

## Business Flow / Luồng nghiệp vụ

1. Người dùng nhập truy vấn.
2. AI diễn giải ý định.
3. Hệ thống đối chiếu catalog public.
4. Kết quả hợp lệ được trả về.
5. Nếu không có kết quả, hiển thị fallback.

## Validation Rule / Quy tắc validation

- Không trả sản phẩm ẩn.
- Không trả sản phẩm không tồn tại.
- Không diễn giải truy vấn y tế thành cam kết chữa bệnh.
- Query độc hại hoặc prompt injection cần bị giới hạn.

## Permission / Phân quyền

Guest/Customer dùng AI Search public. Manager/Admin cấu hình phạm vi catalog. AI không có quyền truy cập dữ liệu private.

## Acceptance Criteria / Tiêu chí hoàn thành

- AI hiểu được truy vấn tự nhiên cơ bản.
- Kết quả dựa trên catalog hợp lệ.
- Có fallback khi không có kết quả.
- Không bịa thông tin sản phẩm.

## Edge Cases / Trường hợp biên

- Từ khóa sai chính tả.
- Truy vấn quá chung.
- Truy vấn liên quan bệnh lý.
- Sản phẩm phù hợp đang hết hàng.

## Error Cases / Trường hợp lỗi

- Không có kết quả.
- AI Gateway lỗi ở phase sau.
- Query vượt phạm vi an toàn.

## Future Enhancement / Mở rộng tương lai

- Search personalization.
- Voice search.
- Query analytics.

