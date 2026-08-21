import { Injectable } from '@nestjs/common';
import { In, type EntityManager } from 'typeorm';

import { InventoryItemEntity, StockReservationEntity } from '../entities';

export type InventoryStockMutationErrorCode =
  | 'INSUFFICIENT_STOCK'
  | 'INVENTORY_UNAVAILABLE'
  | 'INVALID_QUANTITY'
  | 'RESERVATION_NOT_FOUND'
  | 'RESERVATION_STATE_CONFLICT'
  | 'STOCK_INVARIANT_FAILED';

export class InventoryStockMutationError extends Error {
  constructor(
    readonly code: InventoryStockMutationErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'InventoryStockMutationError';
  }
}

export interface ReserveOrderStockInput {
  tenantId: string;
  orderId: string;
  actorUserAccountId: string | null;
  items: ReadonlyArray<{ productId: string; quantity: number }>;
}

@Injectable()
export class InventoryStockMutationRepository {
  async reserveForOrder(manager: EntityManager, input: ReserveOrderStockInput): Promise<void> {
    const requestedByProduct = aggregateRequestedItems(input.items);
    const inventories = manager.getRepository(InventoryItemEntity);
    const reservations = manager.getRepository(StockReservationEntity);
    const now = new Date();
    const discoveredInventories = await inventories.find({
      where: {
        tenantId: input.tenantId,
        productId: In(requestedByProduct.map(([productId]) => productId)),
      },
      withDeleted: true,
    });
    const inventoryByProduct = new Map(
      discoveredInventories.map((inventory) => [inventory.productId, inventory]),
    );
    const lockRequests = requestedByProduct
      .map(([productId, quantity]) => ({
        productId,
        quantity,
        inventoryId: inventoryByProduct.get(productId)?.id ?? null,
      }))
      .sort((left, right) => compareNumericIds(left.inventoryId, right.inventoryId));

    for (const { productId, quantity, inventoryId } of lockRequests) {
      if (!inventoryId) {
        throw new InventoryStockMutationError(
          'INVENTORY_UNAVAILABLE',
          `Inventory không khả dụng cho Product ${productId}.`,
        );
      }
      const inventory = await inventories.findOne({
        where: { tenantId: input.tenantId, id: inventoryId },
        lock: { mode: 'pessimistic_write' },
        withDeleted: true,
      });
      if (!inventory) {
        throw new InventoryStockMutationError(
          'INVENTORY_UNAVAILABLE',
          `Inventory không khả dụng cho Product ${productId}.`,
        );
      }

      const existing = await reservations.findOne({
        where: {
          tenantId: input.tenantId,
          orderId: input.orderId,
          inventoryItemId: inventory.id,
        },
        lock: { mode: 'pessimistic_write' },
      });
      if (existing) {
        if (existing.reservedQuantity === quantity) continue;
        throw new InventoryStockMutationError(
          'RESERVATION_STATE_CONFLICT',
          `Reservation của Order ${input.orderId} không khớp business event gốc.`,
        );
      }
      if (inventory.deletedAt || inventory.stockStatus === 'disabled') {
        throw new InventoryStockMutationError(
          'INVENTORY_UNAVAILABLE',
          `Inventory không khả dụng cho Product ${productId}.`,
        );
      }
      if (inventory.stockStatus === 'out_of_stock' || inventory.availableQuantity < quantity) {
        throw new InventoryStockMutationError(
          'INSUFFICIENT_STOCK',
          `Inventory không đủ cho Product ${productId}.`,
        );
      }

      inventory.availableQuantity -= quantity;
      inventory.reservedQuantity += quantity;
      inventory.stockStatus = nextStockStatus(inventory);
      inventory.updatedBy = input.actorUserAccountId;
      await inventories.save(inventory);
      await reservations.save(
        reservations.create({
          tenantId: input.tenantId,
          inventoryItemId: inventory.id,
          orderId: input.orderId,
          reservedQuantity: quantity,
          reservationStatus: 'active',
          reservedAt: now,
          consumedAt: null,
          releasedAt: null,
          reacquiredAt: null,
          restockedAt: null,
          createdBy: input.actorUserAccountId,
          updatedBy: input.actorUserAccountId,
        }),
      );
    }
  }

  consumeForOrder(
    manager: EntityManager,
    orderId: string,
    actorUserAccountId: string | null = null,
    tenantId = '1',
  ): Promise<void> {
    return this.transitionOrderReservations(
      manager,
      tenantId,
      orderId,
      actorUserAccountId,
      'consume',
    );
  }

  releaseForOrder(
    manager: EntityManager,
    orderId: string,
    actorUserAccountId: string | null = null,
    tenantId = '1',
  ): Promise<void> {
    return this.transitionOrderReservations(
      manager,
      tenantId,
      orderId,
      actorUserAccountId,
      'release',
    );
  }

  restockForOrder(
    manager: EntityManager,
    orderId: string,
    actorUserAccountId: string | null = null,
    tenantId = '1',
  ): Promise<void> {
    return this.transitionOrderReservations(
      manager,
      tenantId,
      orderId,
      actorUserAccountId,
      'restock',
    );
  }

  private async transitionOrderReservations(
    manager: EntityManager,
    tenantId: string,
    orderId: string,
    actorUserAccountId: string | null,
    transition: 'consume' | 'release' | 'restock',
  ): Promise<void> {
    const reservations = manager.getRepository(StockReservationEntity);
    const rows = await reservations.find({
      where: { tenantId, orderId },
      order: { inventoryItemId: 'ASC' },
      lock: { mode: 'pessimistic_write' },
    });
    if (!rows.length) {
      throw new InventoryStockMutationError(
        'RESERVATION_NOT_FOUND',
        `Không tìm thấy stock reservation cho Order ${orderId}.`,
      );
    }

    const inventories = manager.getRepository(InventoryItemEntity);
    for (const reservation of rows) {
      const inventory = await inventories.findOne({
        where: { tenantId: reservation.tenantId, id: reservation.inventoryItemId },
        lock: { mode: 'pessimistic_write' },
        withDeleted: true,
      });
      if (!inventory) {
        throw new InventoryStockMutationError(
          'STOCK_INVARIANT_FAILED',
          `Inventory item ${reservation.inventoryItemId} của reservation không còn tồn tại.`,
        );
      }
      const changed = this.applyTransition(inventory, reservation, transition);
      if (!changed) continue;
      inventory.stockStatus = nextStockStatus(inventory);
      inventory.updatedBy = actorUserAccountId ?? inventory.updatedBy;
      reservation.updatedBy = actorUserAccountId ?? reservation.updatedBy;
      await inventories.save(inventory);
      await reservations.save(reservation);
    }
  }

  private applyTransition(
    inventory: InventoryItemEntity,
    reservation: StockReservationEntity,
    transition: 'consume' | 'release' | 'restock',
  ): boolean {
    const now = new Date();
    if (transition === 'consume') {
      if (reservation.reservationStatus === 'consumed') return false;
      if (reservation.reservationStatus === 'restocked') {
        return this.conflict(reservation, transition);
      }
      if (reservation.reservationStatus === 'released') {
        if (
          inventory.deletedAt ||
          inventory.stockStatus === 'disabled' ||
          inventory.stockStatus === 'out_of_stock' ||
          inventory.availableQuantity < reservation.reservedQuantity
        ) {
          throw new InventoryStockMutationError(
            'INSUFFICIENT_STOCK',
            `Không thể reacquire stock đã release cho Order ${reservation.orderId}.`,
          );
        }
        inventory.availableQuantity -= reservation.reservedQuantity;
        reservation.reacquiredAt = now;
      } else {
        this.assertReservedQuantity(inventory, reservation);
        inventory.reservedQuantity -= reservation.reservedQuantity;
      }
      reservation.reservationStatus = 'consumed';
      reservation.consumedAt = now;
      return true;
    }

    if (transition === 'release') {
      if (
        reservation.reservationStatus === 'released' ||
        reservation.reservationStatus === 'restocked'
      ) {
        return false;
      }
      if (reservation.reservationStatus !== 'active') return this.conflict(reservation, transition);
      this.assertReservedQuantity(inventory, reservation);
      inventory.availableQuantity += reservation.reservedQuantity;
      inventory.reservedQuantity -= reservation.reservedQuantity;
      reservation.reservationStatus = 'released';
      reservation.releasedAt = now;
      return true;
    }

    if (reservation.reservationStatus === 'restocked') return false;
    if (reservation.reservationStatus !== 'consumed') return this.conflict(reservation, transition);
    inventory.availableQuantity += reservation.reservedQuantity;
    reservation.reservationStatus = 'restocked';
    reservation.restockedAt = now;
    return true;
  }

  private assertReservedQuantity(
    inventory: InventoryItemEntity,
    reservation: StockReservationEntity,
  ): void {
    if (inventory.reservedQuantity < reservation.reservedQuantity) {
      throw new InventoryStockMutationError(
        'STOCK_INVARIANT_FAILED',
        `Reserved quantity invariant failed cho Order ${reservation.orderId}.`,
      );
    }
  }

  private conflict(
    reservation: StockReservationEntity,
    transition: 'consume' | 'release' | 'restock',
  ): never {
    throw new InventoryStockMutationError(
      'RESERVATION_STATE_CONFLICT',
      `Không thể ${transition} reservation ${reservation.id} từ ${reservation.reservationStatus}.`,
    );
  }
}

function aggregateRequestedItems(
  items: ReserveOrderStockInput['items'],
): Array<[productId: string, quantity: number]> {
  const requested = new Map<string, number>();
  for (const item of items) {
    if (!item.productId || !Number.isSafeInteger(item.quantity) || item.quantity < 1) {
      throw new InventoryStockMutationError(
        'INVALID_QUANTITY',
        'Order stock mutation yêu cầu Product và quantity nguyên dương.',
      );
    }
    requested.set(item.productId, (requested.get(item.productId) ?? 0) + item.quantity);
  }
  if (!requested.size) {
    throw new InventoryStockMutationError(
      'INVALID_QUANTITY',
      'Order stock mutation yêu cầu ít nhất một Product.',
    );
  }
  return [...requested.entries()].sort(([left], [right]) =>
    left.localeCompare(right, 'en', { numeric: true }),
  );
}

function nextStockStatus(
  inventory: Pick<InventoryItemEntity, 'availableQuantity' | 'stockThreshold' | 'stockStatus'>,
): InventoryItemEntity['stockStatus'] {
  if (inventory.stockStatus === 'disabled') return 'disabled';
  if (inventory.availableQuantity <= 0) return 'out_of_stock';
  if (inventory.stockThreshold > 0 && inventory.availableQuantity <= inventory.stockThreshold) {
    return 'low_stock';
  }
  return 'available';
}

function compareNumericIds(left: string | null, right: string | null): number {
  if (left === right) return 0;
  if (left === null) return 1;
  if (right === null) return -1;
  return left.localeCompare(right, 'en', { numeric: true });
}
