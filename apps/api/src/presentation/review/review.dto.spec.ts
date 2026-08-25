import 'reflect-metadata';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';

import { CreateReviewDto, UpdateReviewDto } from './review.dto';

describe('Review DTO validation', () => {
  it('accepts a canonical create command and trims content', async () => {
    const dto = plainToInstance(CreateReviewDto, {
      orderId: '12',
      productId: '4',
      rating: 5,
      content: '  Sản phẩm tốt  ',
    });
    expect(await validate(dto, { whitelist: true, forbidNonWhitelisted: true })).toHaveLength(0);
    expect(dto.content).toBe('Sản phẩm tốt');
  });

  it.each([
    { orderId: '0', productId: '4', rating: 5, content: 'Hợp lệ' },
    { orderId: '1', productId: 'abc', rating: 5, content: 'Hợp lệ' },
    { orderId: '1', productId: '4', rating: 0, content: 'Hợp lệ' },
    { orderId: '1', productId: '4', rating: 6, content: 'Hợp lệ' },
    { orderId: '1', productId: '4', rating: 5, content: 'x' },
  ])('rejects invalid create payload %#', async (payload) => {
    expect(
      await validate(plainToInstance(CreateReviewDto, payload), {
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    ).not.toHaveLength(0);
  });

  it('rejects mass assignment fields such as customerId and verifiedPurchase', async () => {
    const dto = plainToInstance(CreateReviewDto, {
      orderId: '1',
      productId: '4',
      rating: 5,
      content: 'Hợp lệ',
      customerId: '99',
      verifiedPurchase: true,
    });
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['customerId', 'verifiedPurchase']),
    );
  });

  it('allows a partial update while service owns the non-empty command rule', async () => {
    const dto = plainToInstance(UpdateReviewDto, { rating: 4 });
    expect(await validate(dto)).toHaveLength(0);
  });
});
