# Design System Report / Báo cáo Design System

## Purpose / Mục tiêu

Báo cáo này tổng hợp kết quả Prompt 12: Generate Design System.

## Summary / Tóm tắt

Đã tạo Design System tại `docs/design-system` dựa trên UI Contract, Business Blueprint và Feature Specifications.

Bộ tài liệu bao gồm foundation guideline, token, dark mode, accessibility, component library, component usage map và 30 component specification.

## Design Decisions / Quyết định thiết kế

| Decision / Quyết định | Reason / Lý do |
| --- | --- |
| Đặt tài liệu chính tại `docs/design-system` | Prompt yêu cầu tạo trong `docs/design-system`; thư mục `design/` hiện giữ asset/prototype placeholder. |
| Dùng xanh lá làm primary nhưng bổ sung mint, citrus, berry và blue | HealthyHub cần cảm giác healthy nhưng không được thành UI một tông. |
| Admin UI ưu tiên mật độ và khả năng quét | Staff/Manager cần xử lý đơn, kho, sản phẩm và khách hàng nhanh. |
| Card giới hạn bo góc tối đa 8 | Giữ UI thương mại/admin chuyên nghiệp, tránh quá mềm. |
| AI component có source, confidence và safety | Bám AI Response Contract và AI Feature Map. |
| Dark mode dùng semantic mapping | Tránh đảo màu tự động gây sai ảnh sản phẩm hoặc status. |

## Coverage / Mức bao phủ

| Area / Khu vực | Coverage / Bao phủ |
| --- | --- |
| Foundation | Principles, tokens, color, type, spacing, radius, elevation, shadow, grid, breakpoint. |
| Guidelines | Icon, illustration, motion, dark mode, accessibility. |
| Components | 30 component bắt buộc của Prompt 12. |
| UI Contract Alignment | Có mapping với storefront, checkout, account, admin, analytics và AI screens. |

## Assumptions / Giả định

- Brand visual chính thức chưa có logo final, nên palette là guideline cấp framework.
- Font cụ thể chưa chốt, nên ưu tiên system font hỗ trợ tiếng Việt.
- Chưa quyết định icon package ở Prompt 12; icon source sẽ được xác nhận ở frontend phase.
- Mobile App chưa triển khai, nên Design System chỉ chuẩn bị token và responsive rule.

## Prompt 19 Implementation Report

Đã triển khai shared UI foundation bằng React, TypeScript và Tailwind hiện hữu. Component được nhóm theo `ui/forms/feedback/data-display/overlays/navigation`, composition-first và không phụ thuộc Authentication/Product/Cart/Checkout/Admin business state. Authentication chỉ đổi presentation primitives; logic, API, routing và session security giữ nguyên.

Không thêm dependency, không tạo/sửa/xóa/đổi tên asset. ProductCard chỉ là presentational shell. Modal/Drawer giới hạn theo viewport; controls tối thiểu 44px; focus-visible, semantic roles, aria labels và reduced-motion được tích hợp. Verification thực tế được ghi trong work summary Prompt 19.
