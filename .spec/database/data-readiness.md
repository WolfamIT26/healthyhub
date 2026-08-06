# Data Readiness / Chuẩn bị mở rộng dữ liệu

## Purpose / Mục tiêu

Tài liệu này mô tả các chuẩn bị logical để database của HealthyHub hỗ trợ multi-tenant, audit log, AI, analytics, versioning và soft delete trong tương lai.

## Multi Tenant Readiness / Sẵn sàng multi-tenant

- Entity vận hành thuộc cửa hàng chuẩn bị `tenant_id`.
- `tenant_setting_profiles` là nền để tách cấu hình cửa hàng và cấu hình platform.
- Các báo cáo analytics cần lọc theo `tenant_id` và `report_scope`.
- AI interaction cần ghi `tenant_id` để không trộn dữ liệu giữa các cửa hàng.

## Audit Log Readiness / Sẵn sàng audit log

- Entity quan trọng có `created_by`, `updated_by`, `deleted_by` nếu thao tác bởi user/staff.
- Domain có trạng thái quan trọng dùng history entity riêng như `order_status_histories`, `payment_status_histories`, `shipping_status_histories`.
- Thay đổi cấu hình quan trọng dùng `setting_change_requests`.
- Hành động AI có rủi ro dùng `ai_output_reviews` và `ai_safety_flags`.

## AI Readiness / Sẵn sàng AI

- AI chỉ lưu reference/context metadata, không sao chép dữ liệu nhạy cảm nếu không có policy.
- `ai_knowledge_sources` giúp AI biết nguồn tri thức nội bộ được phép dùng.
- `prompt_contexts` ghi phạm vi context để kiểm tra truy xuất dữ liệu.
- `ai_output_reviews` hỗ trợ review người thật với nội dung marketing, nutrition hoặc quyết định rủi ro.

## Analytics Readiness / Sẵn sàng analytics

- `metric_snapshots` lưu số liệu theo kỳ để giảm phụ thuộc query vận hành nặng.
- `insight_records` lưu insight đã tạo và trạng thái review.
- Dữ liệu cá nhân trong analytics phải giảm thiểu hoặc ẩn danh khi phù hợp.
- Analytics không sửa entity nguồn.

## Versioning Readiness / Sẵn sàng versioning

- Entity cấu hình, nội dung, promotion và AI prompt nên có `version`.
- Order item cần snapshot giá, tên sản phẩm và thông tin nhận hàng tại thời điểm đặt.
- Blog và media có lifecycle rõ để giữ lịch sử public/hidden/review.

## Soft Delete Readiness / Sẵn sàng soft delete

- Entity master data và content dùng soft delete mặc định.
- Entity giao dịch như order, payment, shipping, loyalty transaction và audit history không hard delete trong vận hành thường ngày.
- Hard delete chỉ phù hợp với dữ liệu tạm, draft chưa dùng hoặc dữ liệu pháp lý yêu cầu xóa sau khi đã xử lý audit/privacy đúng quy trình.

## Privacy Readiness / Sẵn sàng bảo vệ dữ liệu

- Customer, AI, Notification và Analytics phải tôn trọng consent và opt-in.
- Không lưu credential hoặc token dạng đọc được ở logical model.
- Dữ liệu provider bên ngoài chỉ lưu reference cần thiết, không lưu secret.
