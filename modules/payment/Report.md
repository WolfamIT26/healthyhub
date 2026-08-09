# Payment Method Foundation Report — Prompt 26.1

## Status

**READY — COD-only selection boundary.**

Approved physical Payment design quy định `cod` là default; `bank_transfer/online` là future. Internal `PaymentMethodReader` vì vậy chỉ expose COD:

- capture không bắt buộc;
- initial payment status là `pending`;
- không tạo paid/provider result;
- mọi method khác bị từ chối.

Không có Payment row, gateway, intent, credential hoặc capture trong Prompt 26.1.
