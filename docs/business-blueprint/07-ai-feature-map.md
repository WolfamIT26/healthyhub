# AI Feature Map / Bản đồ tính năng AI

## AI Principle / Nguyên tắc AI

AI trong HealthyHub hỗ trợ khách hàng và vận hành, nhưng không thay thế quyết định của con người trong các nghiệp vụ rủi ro. AI output phải có nguồn dữ liệu rõ, giới hạn trách nhiệm và fallback khi thiếu thông tin.

## AI Features / Tính năng AI

| AI Feature / Tính năng AI | Purpose / Mục tiêu | Phase / Giai đoạn | Risk Control / Kiểm soát rủi ro |
| --- | --- | --- | --- |
| AI Chat | Trả lời câu hỏi sản phẩm, đơn hàng cơ bản và chính sách cửa hàng. | Version 1.5 | Không trả lời ngoài phạm vi dữ liệu được cung cấp. |
| AI Recommendation | Gợi ý sản phẩm phù hợp nhu cầu và lịch sử quan tâm. | Version 1.5 | Không gợi ý sản phẩm trái cảnh báo dị ứng hoặc chính sách. |
| AI Search | Hiểu từ khóa tự nhiên và gợi ý sản phẩm liên quan. | Version 1.5 | Kết quả phải dựa trên sản phẩm đang được phép bán. |
| AI Compare | So sánh nhiều sản phẩm theo thành phần, giá trị sử dụng và lưu ý. | Version 1.5 | Không khẳng định hiệu quả y tế. |
| AI Nutrition | Giải thích thông tin dinh dưỡng ở mức tham khảo. | Version 2 | Có disclaimer, không chẩn đoán. |
| AI Meal Planner | Gợi ý kế hoạch ăn uống healthy ở mức tham khảo. | Future | Cần cảnh báo không thay thế chuyên gia. |
| AI Calories | Ước lượng calories từ thông tin sản phẩm hoặc input người dùng. | Version 2 | Nêu rõ là ước lượng. |
| AI OCR | Đọc chữ từ nhãn sản phẩm hoặc tài liệu upload. | Future | Cần kiểm tra lại kết quả OCR trước khi lưu. |
| AI Vision | Nhận diện sản phẩm, QR hoặc hình ảnh món ăn. | Future | Không tự động ghi dữ liệu nếu chưa xác nhận. |
| AI Marketing | Gợi ý caption, email, campaign và nội dung blog. | Version 1.5 | Cần review người thật trước khi xuất bản. |
| AI Analytics | Gợi ý insight về doanh số, khách hàng, tồn kho. | Version 1.5 | Manager quyết định, AI chỉ đề xuất. |
| AI Customer Support | Tóm tắt hội thoại, gợi ý phản hồi chăm sóc khách. | Version 1.5 | Không gửi dữ liệu nhạy cảm nếu chưa có policy. |

## AI Data Boundaries / Ranh giới dữ liệu AI

- AI được dùng dữ liệu sản phẩm công khai, chính sách cửa hàng và knowledge base đã duyệt.
- AI cần kiểm soát khi dùng dữ liệu khách hàng, đơn hàng hoặc hành vi mua.
- AI không được nhận secret, mật khẩu, thông tin thanh toán hoặc dữ liệu nhạy cảm chưa được phép.
- AI nutrition phải tránh lời khuyên y tế cá nhân hóa quá mức.

## AI Readiness Requirements / Yêu cầu sẵn sàng AI

- Có knowledge base rõ nguồn.
- Có prompt version.
- Có context pack theo feature.
- Có logging và audit cho AI action quan trọng.
- Có review checklist trước khi đưa AI feature vào production.
- Có fallback khi AI không đủ tự tin hoặc thiếu dữ liệu.

