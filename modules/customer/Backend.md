# Customer Backend / Backend Customer

`CustomerModule` dùng `CustomerOwnerResolver`, `ShippingQuoteService` và TypeORM repository. Controller bắt buộc AccessToken + CUSTOMER role; service resolve owner từ JWT, áp owner constraint ở mọi query và trả cùng 404 cho ID không tồn tại/không thuộc owner.

Global ValidationPipe `whitelist + forbidNonWhitelisted` chống mass assignment. Profile sync allowed fields vào CustomerProfile/UserAccount trong transaction; Address default/soft-delete xử lý bằng transaction và row lock.
