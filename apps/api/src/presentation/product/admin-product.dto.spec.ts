import 'reflect-metadata';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';

import {
  AdminCreateProductDto,
  AdminProductListQueryDto,
  AdminUpdateProductDto,
} from './admin-product.dto';

const valid = {
  sku: 'HH-NEW',
  name: 'Sữa hạt mới',
  slug: 'sua-hat-moi',
  price: '69000.00',
  brandId: null,
  categoryIds: ['1'],
  primaryCategoryId: '1',
  featured: false,
  content: {
    description: 'Mô tả hợp lệ',
    summary: null,
    usageNote: null,
    storageNote: null,
    seoTitle: null,
    seoDescription: null,
    status: 'published',
  },
  nutrition: null,
  ingredients: [],
  dietaryTags: ['vegan'],
  media: [],
};

describe('Admin Product DTO', () => {
  it('accepts the exact create aggregate and rejects invalid nested values', async () => {
    await expect(validate(plainToInstance(AdminCreateProductDto, valid))).resolves.toHaveLength(0);
    const invalid = plainToInstance(AdminCreateProductDto, {
      ...valid,
      slug: 'Unsafe Slug',
      price: '69000',
      dietaryTags: ['invented'],
      content: { ...valid.content, status: 'active', customerId: '7' },
    });
    const errors = await validate(invalid, { whitelist: true, forbidNonWhitelisted: true });
    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['slug', 'price', 'dietaryTags', 'content']),
    );
  });

  it('rejects mass assignment and requires version for update', async () => {
    const update = plainToInstance(AdminUpdateProductDto, {
      ...valid,
      tenantId: '999',
      sellableStatus: 'sellable',
      createdBy: '7',
    });
    const errors = await validate(update, { whitelist: true, forbidNonWhitelisted: true });
    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['tenantId', 'sellableStatus', 'createdBy', 'version']),
    );
  });

  it('whitelists Admin list filter and sort values', async () => {
    const query = plainToInstance(AdminProductListQueryDto, {
      page: '2',
      pageSize: '100',
      productStatus: 'active',
      visibility: 'public',
      categoryId: '3',
      sort: 'price-desc',
    });
    await expect(validate(query)).resolves.toHaveLength(0);
    await expect(
      validate(plainToInstance(AdminProductListQueryDto, { sort: 'DROP TABLE products' })),
    ).resolves.not.toHaveLength(0);
  });
});
