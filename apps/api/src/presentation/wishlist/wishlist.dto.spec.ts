import { ValidationPipe } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import { AddWishlistItemDto, WishlistQueryDto } from './wishlist.dto';

const pipe = new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true });

describe('Wishlist DTO validation', () => {
  it('accepts only a positive BIGINT Product identifier and rejects owner mass assignment', async () => {
    await expect(
      pipe.transform(
        { productId: '1', customerId: '999' },
        { type: 'body', metatype: AddWishlistItemDto },
      ),
    ).rejects.toMatchObject({ status: 400 });
    await expect(
      pipe.transform({ productId: '0' }, { type: 'body', metatype: AddWishlistItemDto }),
    ).rejects.toMatchObject({ status: 400 });
  });

  it('applies Wishlist pagination limits', async () => {
    await expect(
      pipe.transform({ page: '2', pageSize: '60' }, { type: 'query', metatype: WishlistQueryDto }),
    ).resolves.toMatchObject({ page: 2, pageSize: 60 });
    await expect(
      pipe.transform({ page: '1', pageSize: '61' }, { type: 'query', metatype: WishlistQueryDto }),
    ).rejects.toMatchObject({ status: 400 });
  });
});
