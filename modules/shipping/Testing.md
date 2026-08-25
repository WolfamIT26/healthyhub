# Shipping Testing / Kiểm thử Shipping

Unit tests cover the exact graph, skipped/regressive transitions, COD/VNPAY readiness, reason bounds and timestamp chronology. MySQL tests cover valid delivery evidence, duplicate idempotency, concurrent transition serialization, cancel/full-return Inventory effects and history counts.

Customer Order frontend tests cover labels for every executable status. Provider/Sandbox tracking is not represented.

