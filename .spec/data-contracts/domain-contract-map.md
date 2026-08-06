# Domain Contract Map / Bản đồ contract theo domain

## Purpose / Mục tiêu

Tài liệu này mapping domain của HealthyHub sang nhóm Data Contract cần dùng ở các bước API Design, Frontend Design, Mobile Design và AI Integration sau này.

## Mapping Rule / Quy tắc mapping

- Mapping này không tạo endpoint.
- Mapping này không tạo DTO code.
- Mỗi domain chỉ liệt kê nhóm model cần có và các lưu ý bảo mật/dữ liệu.
- Khi thiết kế API sau này, mỗi endpoint phải tham chiếu lại contract group phù hợp.

## Domain Contract Table / Bảng contract theo domain

| Domain / Domain | Request Model / Model request | Response Model / Model response | Key Data / Dữ liệu chính | Sensitive Rule / Quy tắc nhạy cảm |
| --- | --- | --- | --- | --- |
| Authentication | Create session, verify, refresh, revoke | Auth status, token metadata, session summary | Account, session, verification | Không log password, OTP, token raw. |
| User | Create/update profile, role assignment | User summary, user detail, role summary | User account, role, permission | Email/phone cần masking theo quyền. |
| Customer | Customer profile, segment update | Customer summary, customer detail, loyalty summary | Customer, tier, contact info | Dữ liệu cá nhân chỉ theo scope. |
| Staff | Staff profile, staff permission action | Staff summary, staff detail | Staff, role, work status | Admin only, audit hành động thay đổi quyền. |
| Product | Product create/update, product query | Product list item, product detail, option item | Product, ingredient, price, status | Public chỉ trả active/visible product. |
| Category | Category create/update, category query | Category tree, category option, category detail | Category, parent, display order | Không trả archived public. |
| Brand | Brand create/update, brand query | Brand summary, brand detail, brand option | Brand, logo, status | Public chỉ trả brand active. |
| Inventory | Stock adjustment, reservation query | Inventory summary, stock status, movement summary | Stock, movement, reservation | Staff/admin only, cần audit reason. |
| Cart | Cart item add/update/remove | Cart detail, cart price summary | Cart, cart item, availability | Không tin total từ client. |
| Wishlist | Add/remove wishlist item | Wishlist item list, wishlist summary | Customer, product reference | Owner only. |
| Order | Checkout input, order action | Order summary, order detail, order timeline | Order, item snapshot, status | Customer chỉ xem đơn của mình; admin theo scope. |
| Payment | Payment intent/action, refund action | Payment summary, payment status, refund summary | Payment, transaction, provider reference | Không trả provider secret hoặc card data. |
| Shipping | Shipping quote/action, shipment update | Shipping summary, tracking summary | Address snapshot, carrier, tracking | Mask phone/address theo quyền. |
| Coupon | Coupon apply/manage | Coupon summary, coupon validation result | Code, condition, discount | Không trả rule nội bộ quá chi tiết public. |
| Promotion | Promotion manage/query | Promotion summary, promotion detail | Campaign, schedule, condition | Draft/internal chỉ admin. |
| Loyalty | Earn/use point action | Point balance, transaction summary | Customer point, transaction | Owner/admin only, audit điểm. |
| Review | Create/moderate review | Review list item, review detail, rating summary | Review, rating, moderation | Moderation reason admin only. |
| Blog | Blog create/update/query | Blog card, blog detail, SEO metadata | Post, category, media | Draft chỉ staff/admin. |
| Media | Upload/attach/update media | Media asset summary, file URL metadata | File, image, certificate | Storage key private, signed URL nếu cần. |
| Notification | Send/read notification | Notification summary, delivery status | Recipient, channel, template | Không lộ nội dung cá nhân ngoài người nhận. |
| Analytics | Metric query, report export | Metric summary, dashboard dataset | Sales, inventory, customer, AI metric | Aggregation ưu tiên, giới hạn raw data. |
| AI | AI request, AI feedback, AI review | AI answer, AI recommendation, AI insight | Interaction, source, confidence | Không vượt quyền dữ liệu; có safety metadata. |
| Settings | Setting update/query | Setting summary, setting value by scope | Feature flag, config, policy | Secret config không trả public/admin thường. |

## Cross Domain Contract / Contract liên domain

| Flow / Luồng | Domains / Domain liên quan | Contract Rule / Quy tắc contract |
| --- | --- | --- |
| Checkout | Cart, Product, Inventory, Coupon, Order, Payment, Shipping, Customer | Request không gửi final total tự quyết; response trả snapshot đã backend xác nhận. |
| Product detail | Product, Category, Brand, Review, Media, AI | Public contract chỉ include dữ liệu visible và AI recommendation an toàn. |
| Admin order management | Order, Payment, Shipping, Inventory, Notification, Audit | Action request cần reason và trace; response trả timeline đủ cho vận hành. |
| AI recommendation | AI, Product, Customer, Order, Analytics | Chỉ dùng dữ liệu trong permission scope, response có confidence và source policy. |
| Import product data | Product, Category, Brand, Media, Inventory | Import contract có dry-run, row error và audit. |
| Marketing campaign | Promotion, Coupon, Customer, Notification, AI, Analytics | AI output cần human review trước khi publish/send. |

## Public vs Admin Contract / Contract public và admin

| Resource / Tài nguyên | Public Contract / Public | Admin Contract / Admin |
| --- | --- | --- |
| Product | Name, image, price, summary, stock status, visible attributes | Full management fields, status, audit summary, inventory link. |
| Customer | Own profile only | Customer segment, order summary, loyalty summary theo quyền. |
| Order | Own order detail | Operational detail, payment/shipping status, internal note theo quyền. |
| Review | Approved public reviews | Moderation state, rejected reason, audit summary. |
| AI | User-facing safe answer | Interaction log, source policy, review status theo quyền. |

## Future Microservice Readiness / Sẵn sàng tách service

Các contract liên domain phải hạn chế phụ thuộc vào table nội bộ. Nếu tách microservice sau này:

- Product service trả product summary contract cho Order và AI.
- Order service giữ snapshot product/customer/shipping để không phụ thuộc dữ liệu sống.
- Payment service chỉ trả payment summary, không lộ provider internals.
- AI service dùng source reference và source policy thay vì đọc trực tiếp mọi database table.
- Analytics service ưu tiên event/aggregate contract thay vì query xuyên database vận hành.

