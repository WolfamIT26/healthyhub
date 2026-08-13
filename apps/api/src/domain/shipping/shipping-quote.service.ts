import { createHash } from 'node:crypto';

import { Injectable } from '@nestjs/common';

export type ShippingMethodCode = 'manual';

export interface ShippingAddressInput {
  recipientName: string;
  phone: string;
  countryCode: string;
  provinceCity: string;
  district: string;
  ward?: string;
  addressLine: string;
  note?: string;
}

export interface ShippingAddressSnapshot {
  recipientName: string;
  phone: string;
  countryCode: string;
  provinceCity: string;
  district: string;
  ward: string | null;
  addressLine: string;
  note: string | null;
}

export interface ShippingCartContext {
  cartId: string;
  subtotal: string;
  itemCount: number;
  isValid: boolean;
}

export interface ShippingQuote {
  quoteReference: string;
  methodCode: ShippingMethodCode;
  methodName: string;
  shippingFee: '0.00';
  currency: 'VND';
  available: true;
  estimatedDelivery: null;
  addressSnapshot: ShippingAddressSnapshot;
}

export class ShippingValidationError extends Error {
  readonly code = 'SHIPPING_INVALID_ADDRESS';
}

export class ShippingUnavailableError extends Error {
  readonly code = 'SHIPPING_UNAVAILABLE';
}

export class UnsupportedShippingMethodError extends Error {
  readonly code = 'SHIPPING_METHOD_UNSUPPORTED';
}

export class InvalidShippingCartError extends Error {
  readonly code = 'SHIPPING_CART_INVALID';
}

const MANUAL_METHOD = Object.freeze({
  code: 'manual' as const,
  name: 'Giao hàng tiêu chuẩn HealthyHub',
});
const PHONE_PATTERN = /^(?:0\d{9,10}|\+84\d{9,10})$/;
const MONEY_PATTERN = /^\d+\.\d{2}$/;

@Injectable()
export class ShippingQuoteService {
  getAvailableMethods(address: ShippingAddressInput, cart: ShippingCartContext) {
    this.assertCart(cart);
    const snapshot = this.createAddressSnapshot(address);
    return this.isServiceable(snapshot) ? [MANUAL_METHOD] : [];
  }

  quote(
    address: ShippingAddressInput,
    methodCode: string,
    cart: ShippingCartContext,
  ): ShippingQuote {
    this.assertCart(cart);
    if (methodCode !== MANUAL_METHOD.code)
      throw new UnsupportedShippingMethodError('Phương thức giao hàng chưa được hỗ trợ.');
    const addressSnapshot = this.createAddressSnapshot(address);
    if (!this.isServiceable(addressSnapshot))
      throw new ShippingUnavailableError('Địa chỉ nằm ngoài phạm vi Shipping V1.');
    return {
      quoteReference: this.quoteReference(addressSnapshot, cart),
      methodCode: MANUAL_METHOD.code,
      methodName: MANUAL_METHOD.name,
      shippingFee: '0.00',
      currency: 'VND',
      available: true,
      estimatedDelivery: null,
      addressSnapshot,
    };
  }

  validateQuote(
    reference: string,
    address: ShippingAddressInput,
    methodCode: string,
    cart: ShippingCartContext,
  ): boolean {
    return this.quote(address, methodCode, cart).quoteReference === reference;
  }

  createAddressSnapshot(input: ShippingAddressInput): ShippingAddressSnapshot {
    const recipientName = normalize(input.recipientName);
    const phone = normalize(input.phone).replace(/[\s()-]/g, '');
    const countryCode = normalize(input.countryCode).toUpperCase();
    const provinceCity = normalize(input.provinceCity);
    const district = normalize(input.district);
    const ward = optional(input.ward);
    const addressLine = normalize(input.addressLine);
    const note = optional(input.note);
    if (
      recipientName.length < 1 ||
      recipientName.length > 255 ||
      !PHONE_PATTERN.test(phone) ||
      countryCode.length !== 2 ||
      provinceCity.length < 1 ||
      provinceCity.length > 150 ||
      district.length < 1 ||
      district.length > 150 ||
      addressLine.length < 1 ||
      addressLine.length > 500 ||
      (ward?.length ?? 0) > 150 ||
      (note?.length ?? 0) > 500
    )
      throw new ShippingValidationError('Địa chỉ giao hàng không hợp lệ.');
    return Object.freeze({
      recipientName,
      phone,
      countryCode,
      provinceCity,
      district,
      ward,
      addressLine,
      note,
    });
  }

  private isServiceable(address: ShippingAddressSnapshot): boolean {
    return address.countryCode === 'VN';
  }

  private assertCart(cart: ShippingCartContext): void {
    if (
      !cart.cartId ||
      !cart.isValid ||
      !Number.isSafeInteger(cart.itemCount) ||
      cart.itemCount < 1 ||
      !MONEY_PATTERN.test(cart.subtotal) ||
      Number(cart.subtotal) < 0
    ) {
      throw new InvalidShippingCartError('Cart không hợp lệ để lấy shipping quote.');
    }
  }

  private quoteReference(address: ShippingAddressSnapshot, cart: ShippingCartContext): string {
    const canonical = JSON.stringify({ method: MANUAL_METHOD.code, address, cart });
    return `shq_${createHash('sha256').update(canonical).digest('hex').slice(0, 32)}`;
  }
}

function normalize(value: string): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function optional(value?: string): string | null {
  const normalized = typeof value === 'string' ? normalize(value) : '';
  return normalized || null;
}
