# HealthyHub Payment Contract Resolution

## Status

**Contract Resolution Complete — Provider Decision Pending.**

Canonical Payment statuses now follow the shared contract, with monotonic transition rules, safe late verified success after failure and terminal-state regression protection. Browser return is UX-only; verified webhook/provider query is authoritative. Webhook events must be deduplicated by provider/event ID and matched against persisted reference, amount and currency.

COD remains pending and executable. Online integration is blocked until the user approves one provider and its official signature/replay/event-ID semantics can drive dedupe persistence and one adapter. No provider API, SDK, secret, capture or fake success is present.
