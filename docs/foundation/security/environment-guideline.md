# Environment Guideline / Hướng dẫn môi trường

## Purpose / Mục tiêu

Environment Guideline tách rõ development, test, staging và production để tránh dùng nhầm cấu hình, dữ liệu hoặc secret.

## Environment Types / Loại môi trường

| Environment / Môi trường | Usage / Cách dùng |
| --- | --- |
| Development | Chạy local, dữ liệu giả, secret local. |
| Test | Chạy kiểm thử tự động, dữ liệu tạm, có thể reset. |
| Staging | Gần production, dùng để kiểm tra release. |
| Production | Người dùng thật, dữ liệu thật, bảo mật cao nhất. |

## Configuration Rule / Quy tắc cấu hình

- `.env.example` chỉ chứa tên biến và giá trị mẫu không nhạy cảm.
- Không commit `.env` thật.
- Production secret phải được quản lý ngoài repository.
- Mỗi môi trường phải có database, storage và log target tách biệt.

## Related / Liên quan

- [Secret Management Guideline / Quản lý secret](secret-management-guideline.md)
- [Environment Strategy / Chiến lược môi trường](../deployment/environment-strategy.md)

