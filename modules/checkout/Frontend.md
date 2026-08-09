# Checkout Frontend V1

- Single-page responsive `/checkout`: recipient/address form and sticky Order summary on desktop, stacked on mobile.
- Customer route guard plus explicit verified-email gate.
- Reuses Cart context/API client and Design System FormField/Input/Radio/Card/Alert/Skeleton/ErrorState/ConfirmDialog.
- Shipping fee/reference comes from `POST /shipping/quotes`; Confirm sends only address, `manual`, quote reference and `cod` to `POST /orders`.
- One idempotency key per submit attempt is reused after network failure and double submission is disabled.
- Success uses the persisted Order response. Cart/count are not cleared because Cart lifecycle remains undecided.
