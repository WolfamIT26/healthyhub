import { Injectable } from '@nestjs/common';
import { DataSource, type EntityManager } from 'typeorm';

import { CartEntity, CartItemEntity } from '../entities';
import type { CartRepository } from './cart.repository';
import { CustomerProfileEntity } from '../../customer/entities';

@Injectable()
export class TypeOrmCartRepository implements CartRepository {
  constructor(private readonly dataSource: DataSource) {}

  findActive(customerProfileId: string): Promise<CartEntity | null> {
    return this.dataSource.getRepository(CartEntity).findOne({
      where: { tenantId: '1', customerProfileId, cartStatus: 'active' },
    });
  }

  async findOrCreateActive(customerProfileId: string, actorUserAccountId: string): Promise<CartEntity> {
    return this.dataSource.transaction((manager) => this.findOrCreateLocked(manager, customerProfileId, actorUserAccountId));
  }

  listActiveItems(cartId: string): Promise<CartItemEntity[]> {
    return this.dataSource.getRepository(CartItemEntity).find({
      where: { tenantId: '1', cartId, itemStatus: 'active' },
      order: { addedAt: 'ASC', id: 'ASC' },
    });
  }

  async addOrMerge(customerProfileId: string, actorUserAccountId: string, productId: string, quantity: number, maximumQuantity: number): Promise<boolean> {
    return this.dataSource.transaction(async (manager) => {
      const cart = await this.findOrCreateLocked(manager, customerProfileId, actorUserAccountId);
      const items = manager.getRepository(CartItemEntity);
      const active = await items.findOne({
        where: { tenantId: '1', cartId: cart.id, productId, itemStatus: 'active' },
        lock: { mode: 'pessimistic_write' },
      });
      if (active) {
        if (active.quantity + quantity > maximumQuantity) return false;
        active.quantity += quantity;
        active.updatedBy = actorUserAccountId;
        await items.save(active);
        await this.touchCart(manager, cart.id, actorUserAccountId);
        return true;
      }
      const removed = await items.findOne({
        where: { tenantId: '1', cartId: cart.id, productId, itemStatus: 'removed' },
        lock: { mode: 'pessimistic_write' },
        withDeleted: true,
      });
      if (removed) {
        if (quantity > maximumQuantity) return false;
        removed.quantity = quantity;
        removed.itemStatus = 'active';
        removed.addedAt = new Date();
        removed.deletedAt = null;
        removed.deletedBy = null;
        removed.updatedBy = actorUserAccountId;
        await items.save(removed);
        await this.touchCart(manager, cart.id, actorUserAccountId);
        return true;
      }
      await items.save(items.create({
        tenantId: '1', cartId: cart.id, productId, quantity, itemPriceSnapshot: null,
        itemStatus: 'active', addedAt: new Date(), createdBy: actorUserAccountId, updatedBy: actorUserAccountId,
      }));
      await this.touchCart(manager, cart.id, actorUserAccountId);
      return true;
    });
  }

  async updateQuantity(customerProfileId: string, actorUserAccountId: string, cartItemId: string, quantity: number): Promise<boolean> {
    return this.dataSource.transaction(async (manager) => {
      const item = await this.findOwnedItem(manager, customerProfileId, cartItemId, true);
      if (!item) return false;
      item.quantity = quantity;
      item.updatedBy = actorUserAccountId;
      await manager.getRepository(CartItemEntity).save(item);
      await this.touchCart(manager, item.cartId, actorUserAccountId);
      return true;
    });
  }

  async remove(customerProfileId: string, actorUserAccountId: string, cartItemId: string): Promise<boolean> {
    return this.dataSource.transaction(async (manager) => {
      const item = await this.findOwnedItem(manager, customerProfileId, cartItemId, true);
      if (!item) return false;
      item.itemStatus = 'removed';
      item.deletedAt = new Date();
      item.deletedBy = actorUserAccountId;
      item.updatedBy = actorUserAccountId;
      await manager.getRepository(CartItemEntity).save(item);
      await this.touchCart(manager, item.cartId, actorUserAccountId);
      return true;
    });
  }

  findOwnedActiveItem(customerProfileId: string, cartItemId: string): Promise<CartItemEntity | null> {
    return this.findOwnedItem(this.dataSource.manager, customerProfileId, cartItemId, false);
  }

  private async findOrCreateLocked(manager: EntityManager, customerProfileId: string, actorUserAccountId: string): Promise<CartEntity> {
    await manager.getRepository(CustomerProfileEntity).findOneOrFail({
      where: { id: customerProfileId, tenantId: '1', customerStatus: 'active' },
      lock: { mode: 'pessimistic_write' },
    });
    const carts = manager.getRepository(CartEntity);
    const existing = await carts.findOne({
      where: { tenantId: '1', customerProfileId, cartStatus: 'active' },
      lock: { mode: 'pessimistic_write' },
    });
    if (existing) return existing;
    return carts.save(carts.create({
      tenantId: '1', customerProfileId, cartOwnerType: 'customer', guestSessionReference: null,
      cartStatus: 'active', cartValidationStatus: 'not_validated', lastValidatedAt: null,
      createdBy: actorUserAccountId, updatedBy: actorUserAccountId,
    }));
  }

  private async findOwnedItem(manager: EntityManager, customerProfileId: string, cartItemId: string, lock: boolean): Promise<CartItemEntity | null> {
    const cart = await manager.getRepository(CartEntity).findOneBy({
      tenantId: '1', customerProfileId, cartStatus: 'active',
    });
    if (!cart) return null;
    return manager.getRepository(CartItemEntity).findOne({
      where: { id: cartItemId, tenantId: '1', cartId: cart.id, itemStatus: 'active' },
      ...(lock ? { lock: { mode: 'pessimistic_write' as const } } : {}),
    });
  }

  private async touchCart(manager: EntityManager, cartId: string, actorUserAccountId: string): Promise<void> {
    const carts = manager.getRepository(CartEntity);
    const cart = await carts.findOneByOrFail({ id: cartId });
    cart.updatedBy = actorUserAccountId;
    await carts.save(cart);
  }
}
