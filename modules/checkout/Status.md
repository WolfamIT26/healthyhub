# Checkout Status

**Prompt 27.3 Automated Verification PASS — Sandbox E2E BLOCKED.**

`/checkout` dùng server Cart, authoritative Shipping quote và Order boundary thật. Backend payment methods hiện xuất `cod` và `vnpay`; VNPAY redirect đi qua payment intent server-side, browser return không mutate, Result reload persisted backend state. Sandbox thật bị chặn bởi credentials/HTTPS IPN callback chưa cấu hình.

Prompt 29 Address Book integration **READY**: saved address chỉ prefill, manual entry vẫn khả dụng và Order snapshot không đổi.

Prompt 28 giữ nguyên flow và chỉ nối persisted success tới Customer Order detail.

`VNPAY Sandbox E2E: PENDING — environment credentials/public HTTPS callback`
