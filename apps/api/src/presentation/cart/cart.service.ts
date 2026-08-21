import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import { CART_REPOSITORY, type CartRepository } from '../../data/cart/repositories';
import {
  CustomerOwnerResolutionError,
  CustomerOwnerResolver,
} from '../../domain/commerce-dependencies/customer-owner.resolver';
import {
  InventoryAvailabilityReader,
  type AvailabilityStatus,
} from '../../domain/commerce-dependencies/inventory-availability.reader';
import { ProductCommerceReader } from '../../domain/commerce-dependencies/product-commerce.reader';
import { CartException } from './cart.exception';

export interface CartReadModel {
  id: string;
  status: 'active';
  validationStatus: 'valid' | 'invalid' | 'not_validated';
  itemCount: number;
  items: Array<{
    id: string;
    productId: string;
    slug: string;
    name: string;
    thumbnail: null;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
    currency: 'VND';
    availability: AvailabilityStatus;
    availableQuantity: number | null;
  }>;
  subtotal: string;
  currency: 'VND';
  isValid: boolean;
  updatedAt: string;
}

@Injectable()
export class CartService {
  constructor(
    @Inject(CART_REPOSITORY) private readonly repository: CartRepository,
    private readonly products: ProductCommerceReader,
    private readonly inventory: InventoryAvailabilityReader,
    private readonly owners: CustomerOwnerResolver,
  ) {}

  async get(auth: AuthenticatedRequestContext): Promise<CartReadModel> {
    const owner = await this.resolveOwner(auth);
    const cart = await this.repository.findOrCreateActive(
      owner.customerProfileId,
      auth.userAccountId,
    );
    return this.read(cart.id, owner.customerProfileId);
  }

  async add(
    auth: AuthenticatedRequestContext,
    productId: string,
    quantity: number,
  ): Promise<CartReadModel> {
    const owner = await this.resolveOwner(auth);
    const product = await this.products.findSellableProduct(productId);
    if (!product)
      this.fail(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'PRODUCT_NOT_AVAILABLE',
        'Sản phẩm không tồn tại hoặc không còn được phép bán.',
      );
    const availability = await this.inventory.checkAvailability(productId, quantity);
    this.ensureAvailable(availability.status);
    const persisted = await this.repository.addOrMerge(
      owner.customerProfileId,
      auth.userAccountId,
      productId,
      quantity,
      availability.availableQuantity ?? 0,
    );
    if (!persisted)
      this.fail(
        HttpStatus.CONFLICT,
        'INSUFFICIENT_STOCK',
        'Số lượng cộng dồn vượt quá tồn kho hiện có.',
      );
    const cart = await this.repository.findActive(owner.customerProfileId);
    if (!cart)
      this.fail(HttpStatus.CONFLICT, 'CART_CONFLICT', 'Không thể tải giỏ hàng sau khi cập nhật.');
    return this.read(cart.id, owner.customerProfileId);
  }

  async update(
    auth: AuthenticatedRequestContext,
    cartItemId: string,
    quantity: number,
  ): Promise<CartReadModel> {
    const owner = await this.resolveOwner(auth);
    const item = await this.repository.findOwnedActiveItem(owner.customerProfileId, cartItemId);
    if (!item)
      this.fail(
        HttpStatus.NOT_FOUND,
        'CART_ITEM_NOT_FOUND',
        'Không tìm thấy sản phẩm trong giỏ hàng của bạn.',
      );
    const product = await this.products.findSellableProduct(item.productId);
    if (!product)
      this.fail(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'PRODUCT_NOT_AVAILABLE',
        'Sản phẩm không còn được phép bán.',
      );
    const availability = await this.inventory.checkAvailability(item.productId, quantity);
    this.ensureAvailable(availability.status);
    if (
      !(await this.repository.updateQuantity(
        owner.customerProfileId,
        auth.userAccountId,
        cartItemId,
        quantity,
      ))
    ) {
      this.fail(
        HttpStatus.NOT_FOUND,
        'CART_ITEM_NOT_FOUND',
        'Không tìm thấy sản phẩm trong giỏ hàng của bạn.',
      );
    }
    const cart = await this.repository.findActive(owner.customerProfileId);
    if (!cart) this.fail(HttpStatus.NOT_FOUND, 'CART_NOT_FOUND', 'Không tìm thấy giỏ hàng.');
    return this.read(cart.id, owner.customerProfileId);
  }

  async remove(auth: AuthenticatedRequestContext, cartItemId: string): Promise<CartReadModel> {
    const owner = await this.resolveOwner(auth);
    if (!(await this.repository.remove(owner.customerProfileId, auth.userAccountId, cartItemId))) {
      this.fail(
        HttpStatus.NOT_FOUND,
        'CART_ITEM_NOT_FOUND',
        'Không tìm thấy sản phẩm trong giỏ hàng của bạn.',
      );
    }
    const cart = await this.repository.findActive(owner.customerProfileId);
    if (!cart) this.fail(HttpStatus.NOT_FOUND, 'CART_NOT_FOUND', 'Không tìm thấy giỏ hàng.');
    return this.read(cart.id, owner.customerProfileId);
  }

  private async read(cartId: string, customerProfileId: string): Promise<CartReadModel> {
    const cart = await this.repository.findActive(customerProfileId);
    if (!cart || cart.id !== cartId)
      this.fail(
        HttpStatus.FORBIDDEN,
        'CART_ACCESS_DENIED',
        'Bạn không có quyền truy cập giỏ hàng này.',
      );
    const persistedItems = await this.repository.listActiveItems(cart.id);
    const items = (
      await Promise.all(
        persistedItems.map(async (item) => {
          const product = await this.products.getProductCommerceSnapshot(item.productId);
          if (!product) return null;
          const availability = await this.inventory.checkAvailability(
            item.productId,
            item.quantity,
          );
          return {
            id: item.id,
            productId: item.productId,
            slug: product.slug,
            name: product.name,
            thumbnail: null,
            quantity: item.quantity,
            unitPrice: product.currentPrice,
            lineTotal: multiplyMoney(product.currentPrice, item.quantity),
            currency: product.currency,
            availability: product.sellable ? availability.status : ('UNAVAILABLE' as const),
            availableQuantity: availability.availableQuantity,
          };
        }),
      )
    ).filter((item): item is NonNullable<typeof item> => item !== null);
    const subtotal = items.reduce((sum, item) => addMoney(sum, item.lineTotal), '0.00');
    const isValid =
      items.length === persistedItems.length &&
      items.every((item) => item.availability === 'AVAILABLE' || item.availability === 'LOW_STOCK');
    return {
      id: cart.id,
      status: 'active',
      validationStatus: cart.cartValidationStatus,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      items,
      subtotal,
      currency: 'VND',
      isValid,
      updatedAt: cart.updatedAt.toISOString(),
    };
  }

  private async resolveOwner(auth: AuthenticatedRequestContext) {
    try {
      return await this.owners.resolve(auth);
    } catch (error) {
      if (error instanceof CustomerOwnerResolutionError) {
        this.fail(
          HttpStatus.FORBIDDEN,
          'CART_ACCESS_DENIED',
          'Giỏ hàng chỉ dành cho tài khoản Customer hợp lệ.',
        );
      }
      throw error;
    }
  }

  private ensureAvailable(status: AvailabilityStatus): void {
    if (status === 'AVAILABLE' || status === 'LOW_STOCK') return;
    if (status === 'INVALID_QUANTITY')
      this.fail(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'INVALID_QUANTITY',
        'Số lượng phải là số nguyên dương hợp lệ.',
      );
    if (status === 'INSUFFICIENT_STOCK')
      this.fail(
        HttpStatus.CONFLICT,
        'INSUFFICIENT_STOCK',
        'Số lượng yêu cầu vượt quá tồn kho hiện có.',
      );
    this.fail(
      HttpStatus.UNPROCESSABLE_ENTITY,
      'PRODUCT_NOT_AVAILABLE',
      'Sản phẩm hiện không khả dụng.',
    );
  }

  private fail(status: HttpStatus, code: string, message: string): never {
    throw new CartException(
      status,
      code,
      status === HttpStatus.FORBIDDEN
        ? 'PERMISSION'
        : status === HttpStatus.NOT_FOUND
          ? 'NOT_FOUND'
          : status === HttpStatus.CONFLICT
            ? 'CONFLICT'
            : 'VALIDATION',
      message,
    );
  }
}

function multiplyMoney(value: string, quantity: number): string {
  return fromMinorUnits(toMinorUnits(value) * BigInt(quantity));
}

function addMoney(left: string, right: string): string {
  return fromMinorUnits(toMinorUnits(left) + toMinorUnits(right));
}

function toMinorUnits(value: string): bigint {
  const [whole = '0', fraction = ''] = value.split('.');
  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0').slice(0, 2));
}

function fromMinorUnits(value: bigint): string {
  return `${value / 100n}.${(value % 100n).toString().padStart(2, '0')}`;
}
