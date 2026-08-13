import type { WishlistEntity, WishlistItemEntity } from '../entities';

export interface WishlistRepository {
  findActive(customerProfileId: string): Promise<WishlistEntity | null>;
  listActiveItems(wishlistId: string, offset: number, limit: number): Promise<WishlistItemEntity[]>;
  countActiveItems(wishlistId: string): Promise<number>;
  add(
    customerProfileId: string,
    actorUserAccountId: string,
    productId: string,
  ): Promise<WishlistItemEntity>;
  removeOwnedItem(
    customerProfileId: string,
    actorUserAccountId: string,
    wishlistItemId: string,
  ): Promise<{ productId: string; found: boolean }>;
  removeOwnedProduct(
    customerProfileId: string,
    actorUserAccountId: string,
    productId: string,
  ): Promise<{ productId: string; found: boolean }>;
}

export const WISHLIST_REPOSITORY = Symbol('WISHLIST_REPOSITORY');
