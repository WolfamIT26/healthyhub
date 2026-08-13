import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import type { WishlistItemEntity } from '../../data/wishlist/entities';
import { WISHLIST_REPOSITORY, type WishlistRepository } from '../../data/wishlist/repositories';
import {
  CustomerOwnerResolutionError,
  CustomerOwnerResolver,
} from '../../domain/commerce-dependencies/customer-owner.resolver';
import {
  InventoryAvailabilityReader,
  type AvailabilityStatus,
} from '../../domain/commerce-dependencies/inventory-availability.reader';
import { ProductCommerceReader } from '../../domain/commerce-dependencies/product-commerce.reader';
import type { WishlistQueryDto } from './wishlist.dto';
import { WishlistException } from './wishlist.exception';

export interface WishlistItemReadModel {
  wishlistItemId: string;
  product: {
    productId: string;
    name: string | null;
    slug: string | null;
    thumbnail: null;
    currentPrice: string | null;
    currency: 'VND';
    availability: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'UNAVAILABLE';
  };
  addedAt: string;
}

export interface WishlistReadModel {
  items: WishlistItemReadModel[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

@Injectable()
export class WishlistService {
  constructor(
    @Inject(WISHLIST_REPOSITORY) private readonly repository: WishlistRepository,
    private readonly products: ProductCommerceReader,
    private readonly inventory: InventoryAvailabilityReader,
    private readonly owners: CustomerOwnerResolver,
  ) {}

  async get(
    auth: AuthenticatedRequestContext,
    query: WishlistQueryDto,
  ): Promise<WishlistReadModel> {
    const owner = await this.resolveOwner(auth);
    const wishlist = await this.repository.findActive(owner.customerProfileId);
    if (!wishlist) return this.empty(query.page, query.pageSize);
    const totalItems = await this.repository.countActiveItems(wishlist.id);
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / query.pageSize);
    const persistedItems = await this.repository.listActiveItems(
      wishlist.id,
      (query.page - 1) * query.pageSize,
      query.pageSize,
    );
    return {
      items: await Promise.all(persistedItems.map((item) => this.readItem(item))),
      page: query.page,
      pageSize: query.pageSize,
      totalItems,
      totalPages,
    };
  }

  async add(auth: AuthenticatedRequestContext, productId: string): Promise<WishlistItemReadModel> {
    const owner = await this.resolveOwner(auth);
    const product = await this.products.getProductCommerceSnapshot(productId);
    if (!product?.publiclyVisible) this.productNotFound();
    const item = await this.repository.add(owner.customerProfileId, auth.userAccountId, productId);
    return this.readItem(item);
  }

  async removeItem(
    auth: AuthenticatedRequestContext,
    wishlistItemId: string,
  ): Promise<{ productId: string; deleted: true }> {
    this.identifier(wishlistItemId);
    const owner = await this.resolveOwner(auth);
    const result = await this.repository.removeOwnedItem(
      owner.customerProfileId,
      auth.userAccountId,
      wishlistItemId,
    );
    if (!result.found) this.itemNotFound();
    return { productId: result.productId, deleted: true };
  }

  async removeProduct(
    auth: AuthenticatedRequestContext,
    productId: string,
  ): Promise<{ productId: string; deleted: true }> {
    this.identifier(productId);
    const owner = await this.resolveOwner(auth);
    await this.repository.removeOwnedProduct(
      owner.customerProfileId,
      auth.userAccountId,
      productId,
    );
    return { productId, deleted: true };
  }

  private async readItem(item: WishlistItemEntity): Promise<WishlistItemReadModel> {
    const product = await this.products.getProductCommerceSnapshot(item.productId);
    if (!product) {
      return {
        wishlistItemId: item.id,
        product: {
          productId: item.productId,
          name: null,
          slug: null,
          thumbnail: null,
          currentPrice: null,
          currency: 'VND',
          availability: 'UNAVAILABLE',
        },
        addedAt: item.savedAt.toISOString(),
      };
    }
    const availability =
      product.publiclyVisible && product.sellableStatus !== 'unavailable'
        ? this.readAvailability(await this.inventory.checkAvailability(item.productId, 1))
        : 'UNAVAILABLE';
    return {
      wishlistItemId: item.id,
      product: {
        productId: product.productId,
        name: product.name,
        slug: product.slug,
        thumbnail: null,
        currentPrice: product.currentPrice,
        currency: product.currency,
        availability,
      },
      addedAt: item.savedAt.toISOString(),
    };
  }

  private readAvailability(
    availability: Awaited<ReturnType<InventoryAvailabilityReader['checkAvailability']>>,
  ): WishlistItemReadModel['product']['availability'] {
    const status: AvailabilityStatus = availability.status;
    if (status === 'AVAILABLE' || status === 'LOW_STOCK' || status === 'OUT_OF_STOCK') {
      return status;
    }
    if (status === 'INSUFFICIENT_STOCK') return 'OUT_OF_STOCK';
    return 'UNAVAILABLE';
  }

  private async resolveOwner(auth: AuthenticatedRequestContext) {
    try {
      return await this.owners.resolve(auth);
    } catch (error) {
      if (error instanceof CustomerOwnerResolutionError) {
        throw new WishlistException(
          HttpStatus.FORBIDDEN,
          'PERMISSION.WISHLIST.OWNER_REQUIRED',
          'PERMISSION',
          'Wishlist chỉ dành cho tài khoản Customer hợp lệ.',
        );
      }
      throw error;
    }
  }

  private empty(page: number, pageSize: number): WishlistReadModel {
    return { items: [], page, pageSize, totalItems: 0, totalPages: 0 };
  }

  private identifier(value: string): void {
    if (!/^[1-9]\d*$/.test(value)) {
      throw new WishlistException(
        HttpStatus.BAD_REQUEST,
        'VALIDATION.WISHLIST.INVALID_IDENTIFIER',
        'VALIDATION',
        'Mã định danh Wishlist không hợp lệ.',
      );
    }
  }

  private itemNotFound(): never {
    throw new WishlistException(
      HttpStatus.NOT_FOUND,
      'NOT_FOUND.WISHLIST.ITEM_NOT_FOUND',
      'NOT_FOUND',
      'Không tìm thấy sản phẩm trong Wishlist của bạn.',
    );
  }

  private productNotFound(): never {
    throw new WishlistException(
      HttpStatus.NOT_FOUND,
      'NOT_FOUND.PRODUCT.PRODUCT_NOT_FOUND',
      'NOT_FOUND',
      'Không tìm thấy sản phẩm công khai.',
    );
  }
}
