# Integration Test Guideline / Hướng dẫn integration test

## Purpose / Mục tiêu

Integration test kiểm tra nhiều thành phần kết hợp, ví dụ API với service, service với data layer, gateway với mock provider hoặc module contract.

## Test Targets / Mục tiêu test

- API request validation và response format.
- Database transaction và migration behavior.
- Gateway success, timeout và failure mapping.
- Permission enforcement ở backend.
- Module contract giữa các nghiệp vụ.

## Environment Rule / Quy tắc môi trường

Integration test phải dùng môi trường test tách biệt. Không dùng database development hoặc production. Dữ liệu test phải có thể tạo lại và xóa an toàn.

## Related / Liên quan

- [Environment Guideline / Hướng dẫn môi trường](../security/environment-guideline.md)
- [Database Optimization Guideline / Tối ưu database](../performance/database-optimization-guideline.md)

