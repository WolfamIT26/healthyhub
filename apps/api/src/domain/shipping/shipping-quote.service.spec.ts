import { describe, expect, it } from 'vitest';

import {
  InvalidShippingCartError,
  ShippingQuoteService,
  ShippingUnavailableError,
  ShippingValidationError,
  UnsupportedShippingMethodError,
} from './shipping-quote.service';

const address = {
  recipientName: ' Nguyễn Văn A ', phone: '0901234567', countryCode: 'vn',
  provinceCity: 'Hồ Chí Minh', district: 'Quận 1', ward: 'Bến Nghé',
  addressLine: ' 12 Nguyễn Huệ ', note: ' Gọi trước khi giao ',
};
const cart = { cartId: '10', subtotal: '125000.00', itemCount: 2, isValid: true };

describe('ShippingQuoteService', () => {
  const service = new ShippingQuoteService();

  it('returns the approved manual method for a valid serviceable address', () => {
    expect(service.getAvailableMethods(address, cart)).toEqual([
      { code: 'manual', name: 'Giao hàng tiêu chuẩn HealthyHub' },
    ]);
  });

  it('creates an immutable normalized address snapshot for future Order/Shipment use', () => {
    expect(service.createAddressSnapshot(address)).toEqual({
      recipientName: 'Nguyễn Văn A', phone: '0901234567', countryCode: 'VN',
      provinceCity: 'Hồ Chí Minh', district: 'Quận 1', ward: 'Bến Nghé',
      addressLine: '12 Nguyễn Huệ', note: 'Gọi trước khi giao',
    });
  });

  it.each([
    [{ ...address, recipientName: '' }], [{ ...address, phone: '123' }],
    [{ ...address, district: '' }], [{ ...address, addressLine: '' }],
  ])('rejects invalid address data', (invalidAddress) => {
    expect(() => service.quote(invalidAddress, 'manual', cart)).toThrow(ShippingValidationError);
  });

  it('distinguishes a structurally valid but non-serviceable non-VN address', () => {
    const foreignAddress = { ...address, countryCode: 'SG' };
    expect(service.getAvailableMethods(foreignAddress, cart)).toEqual([]);
    expect(() => service.quote(foreignAddress, 'manual', cart)).toThrow(ShippingUnavailableError);
  });

  it('rejects unsupported shipping methods', () => {
    expect(() => service.quote(address, 'express', cart)).toThrow(UnsupportedShippingMethodError);
  });

  it('returns authoritative zero fee and VND without accepting a client fee', () => {
    const quote = service.quote({ ...address, shippingFee: '999999.00' } as never, 'manual', cart);
    expect(quote.shippingFee).toBe('0.00');
    expect(quote.currency).toBe('VND');
    expect(quote).not.toHaveProperty('clientShippingFee');
  });

  it('produces deterministic quote references and revalidates the same context', () => {
    const first = service.quote(address, 'manual', cart);
    const second = service.quote(address, 'manual', cart);
    expect(first.quoteReference).toBe(second.quoteReference);
    expect(service.validateQuote(first.quoteReference, address, 'manual', cart)).toBe(true);
    expect(service.validateQuote(first.quoteReference, address, 'manual', { ...cart, subtotal: '126000.00' })).toBe(false);
  });

  it.each([
    [{ ...cart, isValid: false }], [{ ...cart, itemCount: 0 }],
    [{ ...cart, subtotal: '-1.00' }], [{ ...cart, subtotal: 'invalid' }],
  ])('rejects an invalid authoritative Cart context', (invalidCart) => {
    expect(() => service.quote(address, 'manual', invalidCart)).toThrow(InvalidShippingCartError);
  });
});
