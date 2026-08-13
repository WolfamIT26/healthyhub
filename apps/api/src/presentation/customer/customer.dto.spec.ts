import { ValidationPipe } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import { CreateCustomerAddressDto, UpdateCustomerProfileDto } from './customer.dto';

const pipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
});

describe('Customer DTO validation', () => {
  it('rejects mass-assignment fields on Profile update', async () => {
    await expect(
      pipe.transform(
        { fullName: 'Customer', customerId: '999', email: 'other@example.test' },
        { type: 'body', metatype: UpdateCustomerProfileDto },
      ),
    ).rejects.toMatchObject({ status: 400 });
  });

  it('rejects non-Vietnam or incomplete Address input', async () => {
    await expect(
      pipe.transform(
        {
          recipientName: 'Customer',
          phone: 'invalid',
          countryCode: 'US',
          provinceCity: '',
          district: '',
          addressLine: '',
        },
        { type: 'body', metatype: CreateCustomerAddressDto },
      ),
    ).rejects.toMatchObject({ status: 400 });
  });
});
