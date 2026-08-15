# Inventory Availability Authority Report

**Status: READY for Cart, Wishlist and public Product Catalog consumption.**

`inventory_items` và `InventoryAvailabilityReader` cung cấp read-only availability cho quantity nguyên dương: AVAILABLE, LOW_STOCK, INSUFFICIENT_STOCK, OUT_OF_STOCK, UNAVAILABLE và INVALID_QUANTITY. Missing row không có fake fallback.

Không có stock mutation, reservation, receiving, transfer hoặc Inventory Admin UI trong Prompt 25.6.

Prompt 31 public Product queries join `inventory_items` read-only and map available/low-stock/out-of-stock/disabled or missing rows without exposing quantity. No Inventory mutation was added.
