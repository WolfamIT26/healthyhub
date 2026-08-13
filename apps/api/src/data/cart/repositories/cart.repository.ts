import type { CartEntity, CartItemEntity } from '../entities';

export interface CartRepository {
  findOrCreateActive(customerProfileId: string, actorUserAccountId: string): Promise<CartEntity>;
  findActive(customerProfileId: string): Promise<CartEntity | null>;
  listActiveItems(cartId: string): Promise<CartItemEntity[]>;
  addOrMerge(
    customerProfileId: string,
    actorUserAccountId: string,
    productId: string,
    quantity: number,
    maximumQuantity: number,
  ): Promise<boolean>;
  updateQuantity(
    customerProfileId: string,
    actorUserAccountId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<boolean>;
  remove(
    customerProfileId: string,
    actorUserAccountId: string,
    cartItemId: string,
  ): Promise<boolean>;
  findOwnedActiveItem(
    customerProfileId: string,
    cartItemId: string,
  ): Promise<CartItemEntity | null>;
}

export const CART_REPOSITORY = Symbol('CART_REPOSITORY');
