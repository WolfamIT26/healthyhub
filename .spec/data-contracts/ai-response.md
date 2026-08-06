# AI Response / Chuẩn phản hồi AI

## Purpose / Mục tiêu

Tài liệu này chuẩn hóa response từ AI Layer cho HealthyHub. AI là layer toàn hệ thống, nên response cần đủ traceability, safety, confidence và metadata để frontend, backend, admin, audit và analytics dùng chung.

## AI Response Principle / Nguyên tắc phản hồi AI

- AI response là gợi ý hoặc hỗ trợ, không tự thay thế quyết định nghiệp vụ bắt buộc nếu chưa có rule rõ.
- Mọi AI response liên quan dinh dưỡng, dị ứng hoặc sức khỏe phải có cảnh báo phù hợp.
- AI response không được vượt quyền truy cập dữ liệu của người dùng.
- AI response cần ghi rõ confidence, source policy và human review flag khi có rủi ro.

## Common AI Response Fields / Field AI response dùng chung

| Field / Trường | Required / Bắt buộc | Meaning / Ý nghĩa |
| --- | --- | --- |
| `interactionId` | Có | ID tương tác AI để audit và tra log. |
| `capability` | Có | Nhóm năng lực AI như chat, recommendation, search, compare, OCR, vision. |
| `status` | Có | Trạng thái xử lý AI. |
| `answer` | Có nếu có nội dung trả lời | Nội dung phản hồi chính cho người dùng hoặc admin. |
| `items` | Không | Danh sách gợi ý, kết quả tìm kiếm hoặc object nhận diện. |
| `confidence` | Khuyến nghị | Độ tin cậy dạng DecimalString từ 0 đến 1. |
| `sources` | Có nếu dùng dữ liệu nguồn | Nguồn tham chiếu được phép hiển thị. |
| `safety` | Có | Kết quả kiểm tra an toàn. |
| `requiresHumanReview` | Có với tác vụ rủi ro | Cho biết cần người kiểm tra trước khi dùng. |
| `fallback` | Không | Phản hồi dự phòng khi AI không đủ dữ liệu hoặc provider lỗi. |
| `metadata` | Có | Model/provider abstract, token usage policy, trace và scope nếu được phép. |

## AI Capability Contract / Contract theo năng lực AI

| Capability / Năng lực | Output Focus / Trọng tâm output | Required Guardrail / Chốt an toàn |
| --- | --- | --- |
| AI Chat | Câu trả lời hội thoại và link sản phẩm liên quan | Không tư vấn y tế vượt phạm vi. |
| AI Recommendation | Danh sách sản phẩm gợi ý và lý do | Không dùng dữ liệu cá nhân ngoài quyền. |
| AI Search | Kết quả tìm kiếm và giải thích match | Tôn trọng product visibility. |
| AI Compare | So sánh sản phẩm theo thuộc tính | Không bịa thông tin không có trong product knowledge. |
| AI OCR | Text trích xuất và confidence | Gắn file source và privacy policy. |
| AI Vision | Nhận diện hình ảnh và nhãn | Confidence bắt buộc, không kết luận y tế. |
| AI Meal Planner | Gợi ý thực đơn | Cần disclaimer sức khỏe/dinh dưỡng. |
| AI Calories | Ước tính calories | Luôn ghi là ước tính nếu input không đầy đủ. |
| AI Marketing | Caption, email, campaign idea | Cần human review trước khi publish. |
| AI Analytics | Insight kinh doanh | Ghi rõ data period và confidence. |

## AI Safety Contract / Chuẩn an toàn AI

| Field / Trường | Meaning / Ý nghĩa |
| --- | --- |
| `safetyLevel` | low, medium, high hoặc blocked. |
| `policyFlags` | Các policy được kích hoạt như nutrition, privacy, payment, promotion hoặc unsafe_input. |
| `blockedReason` | Lý do bị chặn nếu safety level là blocked. |
| `disclaimerRequired` | Có cần disclaimer hiển thị không. |
| `humanReviewReason` | Lý do cần người kiểm tra nếu có. |

## AI Source Contract / Chuẩn nguồn AI

| Field / Trường | Meaning / Ý nghĩa | Rule / Quy tắc |
| --- | --- | --- |
| `sourceType` | Loại nguồn | Product, ingredient, nutrition, faq, policy, order, analytics hoặc uploaded_file. |
| `sourceId` | ID nguồn | Chỉ trả nếu user có quyền xem nguồn. |
| `sourceTitle` | Tên nguồn | Có thể masking nếu nguồn nhạy cảm. |
| `sourceUrl` | Link nguồn | Chỉ dùng cho public hoặc signed URL có quyền. |
| `excerptPolicy` | Chính sách trích đoạn | Public, summarized, masked hoặc hidden. |

## AI Nutrition Disclaimer / Cảnh báo dinh dưỡng AI

AI liên quan meal planner, calories, BMR/TDEE, macro suggestion, allergy checker hoặc healthy score phải tuân thủ:

- Ghi rõ kết quả là tham khảo, không thay thế tư vấn y tế chuyên môn.
- Nếu người dùng có bệnh nền, dị ứng nặng, mang thai hoặc trẻ nhỏ, khuyến nghị hỏi chuyên gia.
- Allergy checker không được khẳng định an toàn tuyệt đối nếu thiếu thành phần đầy đủ.
- Calories và macro là ước tính nếu input là ảnh hoặc mô tả tự do.

## AI Audit Rule / Quy tắc audit AI

- Mỗi AI interaction cần có `interactionId`, `requestId`, `traceId`, `capability`, actor và thời điểm xử lý.
- Không lưu raw prompt chứa dữ liệu nhạy cảm nếu chưa có policy.
- Response dùng cho marketing hoặc analytics có thể cần người duyệt trước khi publish hoặc ra quyết định.
- AI recommendation cần lưu reason summary để giải thích về sau.

