# HealthyHub Search & Product Discovery V1

## Phạm vi

`ProductSearch` dùng chung tại Homepage, public header/mobile và Catalog. Prompt 31 chuyển autocomplete sang Product API keyword search; AI semantic search vẫn ngoài scope.

## Server discovery

- Input được trim/gộp whitespace, giữ Unicode tiếng Việt và giới hạn 100 ký tự.
- Sau debounce 250 ms, component gọi Product list với `q`, page 1, tối đa 6 Product cùng public options.
- Mỗi lần input đổi sẽ abort request cũ; response stale không ghi đè suggestion mới.
- Suggestion gồm query, public Product, Category, Brand và dietary option; tối đa 8.
- Product mở `/products/:slug`; filter/search điều hướng bằng URL canonical.

API tìm theo Product name/code/slug, published summary và ingredient keyword. Không tìm internal metadata, không lưu recent search trong local/session storage, cookie hoặc backend và không log query tại frontend.

## Accessibility và lỗi

Combobox/listbox giữ ArrowDown, ArrowUp, Enter, Escape, active descendant và focus behavior. API discovery lỗi sẽ đóng danh sách an toàn; submit vẫn điều hướng tới Catalog để trang hiển thị authoritative loading/error/empty state.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
