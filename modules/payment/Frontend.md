# Payment Frontend Contract

Canonical UI states: `idle`, `creating`, `redirect_required`, `pending`, `paid`, `failed`, `cancelled`. Frontend never sets status itself. Redirect return triggers a status query and keeps pending UX while webhook/provider reconciliation is delayed. Checkout remains COD-only until one provider adapter is executable.
# Prompt 27.1A

No frontend behavior changed. A future VNPAY return screen may display/query status but must never declare or persist payment success from browser parameters.
