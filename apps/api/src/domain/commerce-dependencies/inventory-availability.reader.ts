import { Inject, Injectable } from '@nestjs/common';

import type { InventoryItemEntity } from '../../data/inventory/entities';

export type AvailabilityStatus = 'AVAILABLE' | 'LOW_STOCK' | 'INSUFFICIENT_STOCK' | 'OUT_OF_STOCK' | 'UNAVAILABLE' | 'INVALID_QUANTITY';
export interface AvailabilityResult { status: AvailabilityStatus; availableQuantity: number | null }
export interface InventoryAvailabilityRepository { findByProductId(productId: string): Promise<InventoryItemEntity | null> }
export const INVENTORY_AVAILABILITY_REPOSITORY = Symbol('INVENTORY_AVAILABILITY_REPOSITORY');

@Injectable()
export class InventoryAvailabilityReader {
  constructor(@Inject(INVENTORY_AVAILABILITY_REPOSITORY) private readonly repository: InventoryAvailabilityRepository) {}

  async checkAvailability(productId: string, quantity: number): Promise<AvailabilityResult> {
    if (!Number.isSafeInteger(quantity) || quantity < 1) return { status: 'INVALID_QUANTITY', availableQuantity: null };
    const item = await this.repository.findByProductId(productId);
    if (!item || item.deletedAt || item.stockStatus === 'disabled') return { status: 'UNAVAILABLE', availableQuantity: null };
    if (item.stockStatus === 'out_of_stock' || item.availableQuantity === 0) return { status: 'OUT_OF_STOCK', availableQuantity: 0 };
    if (quantity > item.availableQuantity) return { status: 'INSUFFICIENT_STOCK', availableQuantity: item.availableQuantity };
    return { status: item.stockStatus === 'low_stock' ? 'LOW_STOCK' : 'AVAILABLE', availableQuantity: item.availableQuantity };
  }
}
