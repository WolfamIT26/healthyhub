# Paths / Đường dẫn API

Thư mục này chứa bản đồ endpoint theo domain để dễ tra cứu. OpenAPI chính vẫn nằm ở `../openapi.yaml`.

## Files / File

- `domain-map.yaml`: danh sách 23 domain, số lượng endpoint và operationId tương ứng.

## Usage / Cách dùng

Khi AI Agent cần tìm endpoint theo nghiệp vụ, đọc `domain-map.yaml` trước rồi mở `../openapi.yaml` để xem chi tiết request, response, security và error.
