# Module Implementation Checklist Template / Mẫu checklist triển khai module

## Context / Ngữ cảnh

- [ ] Đã đọc context pack liên quan.
- [ ] Đã đọc Feature Specification.
- [ ] Đã đọc Domain Model.
- [ ] Đã đọc Data Contract nếu có API/data.
- [ ] Đã đọc API Specification nếu có endpoint.
- [ ] Đã đọc UI Contract và Design System nếu có UI.

## Implementation / Triển khai

- [ ] Backend đúng NestJS Modular Monolith.
- [ ] Frontend đúng React feature/module structure.
- [ ] Database thay đổi đúng Physical Database Design.
- [ ] Gateway đi qua abstraction.
- [ ] Validation đầy đủ.
- [ ] Permission đúng.
- [ ] Error mapping đúng contract.
- [ ] Logging không lộ dữ liệu nhạy cảm.

## Quality / Chất lượng

- [ ] Không dùng `any` tùy tiện.
- [ ] Không hardcode secret/config/role/status.
- [ ] Không trùng lặp business logic.
- [ ] Có loading/empty/error/success state nếu có UI.
- [ ] Responsive và accessibility đạt yêu cầu.
- [ ] Performance không có rủi ro rõ như N+1 hoặc list không pagination.

## Verification / Kiểm tra

- [ ] Lint đạt.
- [ ] Test liên quan đạt.
- [ ] Build đạt.
- [ ] Tự review diff.
- [ ] Không còn Critical/High issue.

## Documentation / Tài liệu

- [ ] Status cập nhật.
- [ ] Report cập nhật.
- [ ] Checklist cập nhật.
- [ ] ChangeLog cập nhật.
- [ ] TODO cập nhật nếu có.
- [ ] Decision cập nhật nếu có quyết định mới.

