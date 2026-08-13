import { Injectable } from '@nestjs/common';
import { DataSource, type EntityManager } from 'typeorm';

import { CustomerProfileEntity } from '../../customer/entities';
import { WishlistEntity, WishlistItemEntity } from '../entities';
import type { WishlistRepository } from './wishlist.repository';

const DEFAULT_WISHLIST_NAME = 'Default';

@Injectable()
export class TypeOrmWishlistRepository implements WishlistRepository {
  constructor(private readonly dataSource: DataSource) {}

  findActive(customerProfileId: string): Promise<WishlistEntity | null> {
    return this.dataSource.getRepository(WishlistEntity).findOne({
      where: { tenantId: '1', customerProfileId, wishlistStatus: 'active' },
    });
  }

  listActiveItems(
    wishlistId: string,
    offset: number,
    limit: number,
  ): Promise<WishlistItemEntity[]> {
    return this.dataSource.getRepository(WishlistItemEntity).find({
      where: { tenantId: '1', wishlistId, wishlistItemStatus: 'active' },
      order: { savedAt: 'DESC', id: 'DESC' },
      skip: offset,
      take: limit,
    });
  }

  countActiveItems(wishlistId: string): Promise<number> {
    return this.dataSource.getRepository(WishlistItemEntity).countBy({
      tenantId: '1',
      wishlistId,
      wishlistItemStatus: 'active',
    });
  }

  async add(
    customerProfileId: string,
    actorUserAccountId: string,
    productId: string,
  ): Promise<WishlistItemEntity> {
    return this.dataSource.transaction(async (manager) => {
      const wishlist = await this.findOrCreateLocked(
        manager,
        customerProfileId,
        actorUserAccountId,
      );
      const items = manager.getRepository(WishlistItemEntity);
      const active = await items.findOne({
        where: {
          tenantId: '1',
          wishlistId: wishlist.id,
          productId,
          wishlistItemStatus: 'active',
        },
        lock: { mode: 'pessimistic_write' },
      });
      if (active) return active;

      const removed = await items.findOne({
        where: {
          tenantId: '1',
          wishlistId: wishlist.id,
          productId,
          wishlistItemStatus: 'removed',
        },
        withDeleted: true,
        lock: { mode: 'pessimistic_write' },
      });
      if (removed) {
        removed.wishlistItemStatus = 'active';
        removed.savedAt = new Date();
        removed.deletedAt = null;
        removed.deletedBy = null;
        removed.updatedBy = actorUserAccountId;
        return items.save(removed);
      }

      return items.save(
        items.create({
          tenantId: '1',
          wishlistId: wishlist.id,
          productId,
          savedAt: new Date(),
          wishlistItemStatus: 'active',
          note: null,
          createdBy: actorUserAccountId,
          updatedBy: actorUserAccountId,
        }),
      );
    });
  }

  removeOwnedItem(
    customerProfileId: string,
    actorUserAccountId: string,
    wishlistItemId: string,
  ): Promise<{ productId: string; found: boolean }> {
    return this.remove(customerProfileId, actorUserAccountId, { wishlistItemId });
  }

  removeOwnedProduct(
    customerProfileId: string,
    actorUserAccountId: string,
    productId: string,
  ): Promise<{ productId: string; found: boolean }> {
    return this.remove(customerProfileId, actorUserAccountId, { productId });
  }

  private async remove(
    customerProfileId: string,
    actorUserAccountId: string,
    identity: { wishlistItemId: string } | { productId: string },
  ): Promise<{ productId: string; found: boolean }> {
    return this.dataSource.transaction(async (manager) => {
      await this.lockCustomer(manager, customerProfileId);
      const wishlist = await manager.getRepository(WishlistEntity).findOne({
        where: { tenantId: '1', customerProfileId, wishlistStatus: 'active' },
        lock: { mode: 'pessimistic_write' },
      });
      if (!wishlist) {
        return {
          productId: 'productId' in identity ? identity.productId : '',
          found: false,
        };
      }
      const items = manager.getRepository(WishlistItemEntity);
      const item = await items.findOne({
        where: {
          tenantId: '1',
          wishlistId: wishlist.id,
          ...('wishlistItemId' in identity
            ? { id: identity.wishlistItemId }
            : { productId: identity.productId }),
        },
        withDeleted: true,
        lock: { mode: 'pessimistic_write' },
      });
      if (!item) {
        return {
          productId: 'productId' in identity ? identity.productId : '',
          found: false,
        };
      }
      if (item.wishlistItemStatus !== 'removed') {
        item.wishlistItemStatus = 'removed';
        item.deletedAt = new Date();
        item.deletedBy = actorUserAccountId;
        item.updatedBy = actorUserAccountId;
        await items.save(item);
      }
      return { productId: item.productId, found: true };
    });
  }

  private async findOrCreateLocked(
    manager: EntityManager,
    customerProfileId: string,
    actorUserAccountId: string,
  ): Promise<WishlistEntity> {
    await this.lockCustomer(manager, customerProfileId);
    const wishlists = manager.getRepository(WishlistEntity);
    const existing = await wishlists.findOne({
      where: { tenantId: '1', customerProfileId, wishlistStatus: 'active' },
      lock: { mode: 'pessimistic_write' },
    });
    if (existing) return existing;
    return wishlists.save(
      wishlists.create({
        tenantId: '1',
        customerProfileId,
        wishlistName: DEFAULT_WISHLIST_NAME,
        wishlistVisibility: 'private',
        wishlistStatus: 'active',
        createdBy: actorUserAccountId,
        updatedBy: actorUserAccountId,
      }),
    );
  }

  private async lockCustomer(manager: EntityManager, customerProfileId: string): Promise<void> {
    await manager.getRepository(CustomerProfileEntity).findOneOrFail({
      where: { id: customerProfileId, tenantId: '1', customerStatus: 'active' },
      lock: { mode: 'pessimistic_write' },
    });
  }
}
