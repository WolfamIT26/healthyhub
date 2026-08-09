# Checkout Backend Status

**Dependencies executable; Checkout orchestration chưa triển khai.**

Đã có COD-only `PaymentMethodReader`, stateless `ShippingQuoteService` và transactional `OrderCreationService`/`POST /orders`. Order lưu Payment/Shipment selection snapshot ở trạng thái pending; không có gateway/capture hoặc fulfillment. Prompt 26.2 sẽ tích hợp Checkout UI với boundary này.
