# Checkout Frontend V1

- Single-page responsive `/checkout`: recipient/address form and sticky Order summary on desktop, stacked on mobile.
- Customer route guard plus explicit verified-email gate.
- Reuses Cart context/API client and Design System FormField/Input/Radio/Card/Alert/Skeleton/ErrorState/ConfirmDialog.
- Shipping fee/reference comes from `POST /shipping/quotes`; payment method radio is loaded from backend and currently shows `cod` + `vnpay`.
- Confirm sends only address, `manual`, quote reference and selected payment method to `POST /orders`.
- One idempotency key per submit attempt is reused after network failure and double submission is disabled.
- For VNPAY, frontend calls payment intent after Order persistence and redirects to sandbox URL returned by backend.
- Success uses the persisted Order response. Cart/count are not cleared because Cart lifecycle remains undecided.
- Prompt 29 loads owner Address Book, selects the default for prefill, supports manual fallback and never sends saved address ID as Order authority.
