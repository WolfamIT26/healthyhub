import { ValidationPipe } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import { PublicProductQueryDto } from './product.dto';

const pipe = new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true });

describe('PublicProductQueryDto', () => {
  it('transforms approved list filters and dietary values', async () => {
    await expect(
      pipe.transform(
        {
          page: '2',
          pageSize: '12',
          dietary: 'vegan,gluten-free',
          minPrice: '10000',
          maxPrice: '90000',
          availability: 'in_stock',
          sort: 'price-asc',
        },
        { type: 'query', metatype: PublicProductQueryDto },
      ),
    ).resolves.toMatchObject({
      page: 2,
      pageSize: 12,
      dietary: ['vegan', 'gluten-free'],
      minPrice: 10000,
      maxPrice: 90000,
    });
  });

  it('rejects unapproved sort/filter values and oversized pagination', async () => {
    await expect(
      pipe.transform(
        {
          pageSize: '100',
          dietary: 'medical-cure',
          availability: 'reserved',
          sort: 'internal-cost',
        },
        { type: 'query', metatype: PublicProductQueryDto },
      ),
    ).rejects.toMatchObject({ status: 400 });
    await expect(
      pipe.transform({ sort: 'rating' }, { type: 'query', metatype: PublicProductQueryDto }),
    ).rejects.toMatchObject({ status: 400 });
  });
});
