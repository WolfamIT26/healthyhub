# Customer Testing / Kiểm thử Customer

Unit tests bao phủ Profile load/update, email read-only, Internal/missing owner, Address CRUD/default, isolation, validation, mass-assignment và create idempotency conflict. Frontend tests bao phủ loading/empty/error/success, validation, add/edit/delete và Checkout saved-address prefill.

MySQL integration kiểm tra Profile sync, default uniqueness/promotion, Customer A/B isolation, soft-delete retry và Order/Shipment address snapshot không đổi sau khi Address Book bị sửa.
