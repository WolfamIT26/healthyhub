# Inventory Prompt / Prompt Inventory

Trước khi sửa Inventory, đọc Product, Cart, Checkout, Order và Payment lifecycle hiện hành. Reuse `InventoryAvailabilityReader`/`inventory_items`, giữ backend authority, không expose internal quantity và không tự phát minh reservation/deduction/release rule.
