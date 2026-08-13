import { Inject, Injectable } from '@nestjs/common';

import type { ProductEntity } from '../../data/product/entities';

export interface ProductCommerceSnapshot {
  productId: string;
  productCode: string;
  name: string;
  slug: string;
  currentPrice: string;
  currency: 'VND';
  sellable: boolean;
}

export interface ProductCommerceRepository {
  findById(productId: string): Promise<ProductEntity | null>;
}
export const PRODUCT_COMMERCE_REPOSITORY = Symbol('PRODUCT_COMMERCE_REPOSITORY');

@Injectable()
export class ProductCommerceReader {
  constructor(
    @Inject(PRODUCT_COMMERCE_REPOSITORY) private readonly repository: ProductCommerceRepository,
  ) {}

  async getProductCommerceSnapshot(productId: string): Promise<ProductCommerceSnapshot | null> {
    const product = await this.repository.findById(productId);
    if (!product || product.deletedAt) return null;
    return {
      productId: product.id,
      productCode: product.productCode,
      name: product.productName,
      slug: product.slug,
      currentPrice: product.basePrice,
      currency: 'VND',
      sellable:
        product.productStatus === 'active' &&
        product.productVisibility === 'public' &&
        product.sellableStatus === 'sellable',
    };
  }

  async findSellableProduct(productId: string): Promise<ProductCommerceSnapshot | null> {
    const snapshot = await this.getProductCommerceSnapshot(productId);
    return snapshot?.sellable ? snapshot : null;
  }
}
