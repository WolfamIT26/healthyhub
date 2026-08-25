# Review Frontend / Frontend Review

Product Detail gọi public list/summary và render average, total, distribution 1–5, Review list, verified badge, pagination và loading/error/empty state từ backend.

Guest nhận login CTA. Customer gọi `/me/reviews?productId=...`; form chỉ mở khi server trả eligible Order identity. Owner có edit/delete confirmation; returned Review giữ content và hiển thị giải thích badge đã revoke. React render content dưới dạng text, không inject HTML.

Không mở route `/account/reviews` riêng hoặc Admin moderation UI trong Prompt 33.2; owner operations được tích hợp trực tiếp ở Product Detail.
