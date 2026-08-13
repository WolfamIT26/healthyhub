import { createHash, randomBytes } from 'node:crypto';

import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import {
  AUTHENTICATION_REPOSITORY,
  type AuthenticationRepository,
} from '../../data/authentication/repositories';
import { CART_REPOSITORY, type CartRepository } from '../../data/cart/repositories';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
  type PersistedOrderAggregate,
} from '../../data/order/repositories';
import {
  CustomerOwnerResolutionError,
  CustomerOwnerResolver,
} from '../../domain/commerce-dependencies/customer-owner.resolver';
import { InventoryAvailabilityReader } from '../../domain/commerce-dependencies/inventory-availability.reader';
import { ProductCommerceReader } from '../../domain/commerce-dependencies/product-commerce.reader';
import {
  PaymentMethodReader,
  UnsupportedPaymentMethodError,
} from '../../domain/payment/payment-method.reader';
import {
  ShippingQuoteService,
  ShippingUnavailableError,
  ShippingValidationError,
  UnsupportedShippingMethodError,
} from '../../domain/shipping/shipping-quote.service';
import { EmailVerificationPolicyService } from '../authentication/email-verification-policy.service';
import type { CreateOrderDto } from './order.dto';
import { OrderException } from './order.exception';

export interface OrderReadModel {
  orderId: string;
  orderNumber: string;
  status: 'new' | 'confirmed';
  paymentStatus: 'unpaid' | 'pending' | 'paid' | 'failed' | 'cancelled';
  paymentMethod: 'cod' | 'vnpay';
  shippingStatus: 'pending';
  shippingMethod: 'manual';
  items: Array<{
    productId: string | null;
    productName: string;
    sku: string | null;
    unitPrice: string;
    quantity: number;
    lineTotal: string;
  }>;
  subtotal: string;
  shippingFee: string;
  total: string;
  currency: 'VND';
  shippingAddress: Record<string, string | null>;
  createdAt: string;
}

@Injectable()
export class OrderCreationService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
    @Inject(CART_REPOSITORY) private readonly carts: CartRepository,
    @Inject(AUTHENTICATION_REPOSITORY) private readonly authentication: AuthenticationRepository,
    private readonly owners: CustomerOwnerResolver,
    private readonly products: ProductCommerceReader,
    private readonly inventory: InventoryAvailabilityReader,
    private readonly shipping: ShippingQuoteService,
    private readonly payments: PaymentMethodReader,
    private readonly verification: EmailVerificationPolicyService,
  ) {}

  async createOrderFromCheckout(
    auth: AuthenticatedRequestContext,
    idempotencyKey: string | undefined,
    input: CreateOrderDto,
  ): Promise<OrderReadModel> {
    this.assertIdempotencyKey(idempotencyKey);
    const owner = await this.resolveOwner(auth);
    const account = await this.authentication.findAccountById(auth.userAccountId);
    if (!account)
      this.fail(
        HttpStatus.FORBIDDEN,
        'ORDER.ACCESS_DENIED',
        'Không thể xác định tài khoản Customer.',
      );
    this.verification.assertVerified(account);

    const address = this.shippingAddress(input.shippingAddress);
    const requestHash = hash(
      JSON.stringify({
        address,
        shippingMethod: input.shippingMethod,
        shippingQuoteReference: input.shippingQuoteReference,
        paymentMethod: input.paymentMethod,
      }),
    );
    const keyHash = hash(idempotencyKey!);
    const existing = await this.orders.findByIdempotency(owner.customerProfileId, keyHash);
    if (existing) return this.resolveIdempotent(existing, requestHash);

    const cart = await this.carts.findActive(owner.customerProfileId);
    if (!cart)
      this.fail(HttpStatus.UNPROCESSABLE_ENTITY, 'ORDER.CART_EMPTY', 'Giỏ hàng đang trống.');
    const cartItems = await this.carts.listActiveItems(cart.id);
    if (!cartItems.length)
      this.fail(HttpStatus.UNPROCESSABLE_ENTITY, 'ORDER.CART_EMPTY', 'Giỏ hàng đang trống.');
    const snapshots = [];
    for (const item of cartItems) {
      const product = await this.products.findSellableProduct(item.productId);
      if (!product)
        this.fail(
          HttpStatus.CONFLICT,
          'ORDER.CART_INVALID',
          'Sản phẩm trong giỏ không còn được phép bán.',
        );
      const availability = await this.inventory.checkAvailability(item.productId, item.quantity);
      if (availability.status === 'INSUFFICIENT_STOCK' || availability.status === 'OUT_OF_STOCK') {
        this.fail(
          HttpStatus.CONFLICT,
          'ORDER.INSUFFICIENT_STOCK',
          'Tồn kho không đủ để tạo đơn hàng.',
        );
      }
      if (availability.status !== 'AVAILABLE' && availability.status !== 'LOW_STOCK') {
        this.fail(HttpStatus.CONFLICT, 'ORDER.CART_INVALID', 'Giỏ hàng không còn hợp lệ.');
      }
      snapshots.push({
        productId: product.productId,
        productName: product.name,
        sku: product.productCode,
        unitPrice: product.currentPrice,
        quantity: item.quantity,
        lineTotal: multiplyMoney(product.currentPrice, item.quantity),
      });
    }
    const subtotal = snapshots.reduce((sum, item) => addMoney(sum, item.lineTotal), '0.00');
    const cartContext = {
      cartId: cart.id,
      subtotal,
      itemCount: snapshots.reduce((sum, item) => sum + item.quantity, 0),
      isValid: true,
    };
    const quote = this.shippingQuote(input, cartContext);
    if (quote.quoteReference !== input.shippingQuoteReference) {
      this.fail(
        HttpStatus.CONFLICT,
        'ORDER.SHIPPING_INVALID',
        'Shipping quote đã thay đổi hoặc không còn hợp lệ.',
      );
    }
    let payment;
    try {
      payment = this.payments.requireExecutableMethod(input.paymentMethod);
    } catch (error) {
      if (error instanceof UnsupportedPaymentMethodError) {
        this.fail(
          HttpStatus.UNPROCESSABLE_ENTITY,
          'ORDER.PAYMENT_METHOD_UNSUPPORTED',
          'Phương thức thanh toán chưa được hỗ trợ.',
        );
      }
      throw error;
    }
    const total = addMoney(subtotal, quote.shippingFee);
    const persistenceInput = {
      customerProfileId: owner.customerProfileId,
      cartId: cart.id,
      orderCode: createOrderCode(),
      orderTotal: total,
      idempotencyKeyHash: keyHash,
      requestHash,
      actorUserAccountId: auth.userAccountId,
      items: snapshots,
      payment: { method: payment.code, amount: total, status: payment.initialPaymentStatus },
      shipping: {
        method: quote.methodCode,
        fee: quote.shippingFee,
        address: {
          recipientName: quote.addressSnapshot.recipientName,
          phone: quote.addressSnapshot.phone,
          addressText: JSON.stringify({
            countryCode: quote.addressSnapshot.countryCode,
            provinceCity: quote.addressSnapshot.provinceCity,
            district: quote.addressSnapshot.district,
            ward: quote.addressSnapshot.ward,
            addressLine: quote.addressSnapshot.addressLine,
          }),
          note: quote.addressSnapshot.note,
        },
      },
    } as const;
    try {
      return this.toReadModel(await this.orders.createSnapshot(persistenceInput));
    } catch (error) {
      const raced = await this.orders.findByIdempotency(owner.customerProfileId, keyHash);
      if (raced) return this.resolveIdempotent(raced, requestHash);
      throw error;
    }
  }

  private resolveIdempotent(
    aggregate: PersistedOrderAggregate,
    requestHash: string,
  ): OrderReadModel {
    if (aggregate.order.requestHash !== requestHash) {
      this.fail(
        HttpStatus.CONFLICT,
        'ORDER.IDEMPOTENCY_CONFLICT',
        'Idempotency-Key đã được dùng với nội dung khác.',
      );
    }
    return this.toReadModel(aggregate);
  }

  private shippingAddress(input: CreateOrderDto['shippingAddress']) {
    try {
      return this.shipping.createAddressSnapshot(input);
    } catch (error) {
      if (error instanceof ShippingValidationError || error instanceof ShippingUnavailableError) {
        this.fail(
          HttpStatus.UNPROCESSABLE_ENTITY,
          'ORDER.SHIPPING_INVALID',
          'Địa chỉ giao hàng không hợp lệ hoặc không được hỗ trợ.',
        );
      }
      throw error;
    }
  }

  private shippingQuote(
    input: CreateOrderDto,
    cart: { cartId: string; subtotal: string; itemCount: number; isValid: boolean },
  ) {
    try {
      return this.shipping.quote(input.shippingAddress, input.shippingMethod, cart);
    } catch (error) {
      if (
        error instanceof ShippingValidationError ||
        error instanceof ShippingUnavailableError ||
        error instanceof UnsupportedShippingMethodError
      ) {
        this.fail(
          HttpStatus.UNPROCESSABLE_ENTITY,
          'ORDER.SHIPPING_INVALID',
          'Shipping method hoặc địa chỉ không hợp lệ.',
        );
      }
      throw error;
    }
  }

  private toReadModel(aggregate: PersistedOrderAggregate): OrderReadModel {
    const subtotal = aggregate.items.reduce((sum, item) => addMoney(sum, item.lineTotal), '0.00');
    const address = JSON.parse(aggregate.shippingAddress.addressText) as Record<
      string,
      string | null
    >;
    return {
      orderId: aggregate.order.id,
      orderNumber: aggregate.order.orderCode,
      status: aggregate.order.orderStatus,
      paymentStatus:
        aggregate.payment.paymentStatus === 'unpaid' ? 'pending' : aggregate.payment.paymentStatus,
      paymentMethod: aggregate.payment.paymentMethod,
      shippingStatus: aggregate.shipment.shippingStatus,
      shippingMethod: aggregate.shipment.shippingMethod,
      items: aggregate.items.map((item) => ({
        productId: item.productId,
        productName: item.productNameSnapshot,
        sku: item.skuSnapshot,
        unitPrice: item.unitPriceSnapshot,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
      subtotal,
      shippingFee: aggregate.shipment.shippingFee,
      total: aggregate.order.orderTotal,
      currency: 'VND',
      shippingAddress: {
        recipientName: aggregate.shippingAddress.recipientName,
        phone: aggregate.shippingAddress.recipientPhone,
        ...address,
        note: aggregate.shippingAddress.deliveryNote,
      },
      createdAt: aggregate.order.placedAt.toISOString(),
    };
  }

  private async resolveOwner(auth: AuthenticatedRequestContext) {
    try {
      return await this.owners.resolve(auth);
    } catch (error) {
      if (error instanceof CustomerOwnerResolutionError)
        this.fail(HttpStatus.FORBIDDEN, 'ORDER.ACCESS_DENIED', 'Order chỉ dành cho Customer.');
      throw error;
    }
  }

  private assertIdempotencyKey(key?: string): asserts key is string {
    if (!key || key.length < 8 || key.length > 191 || !/^[A-Za-z0-9._:-]+$/.test(key)) {
      this.fail(
        HttpStatus.BAD_REQUEST,
        'ORDER.IDEMPOTENCY_KEY_INVALID',
        'Idempotency-Key không hợp lệ.',
      );
    }
  }

  private fail(status: HttpStatus, code: string, message: string): never {
    const category =
      status === HttpStatus.FORBIDDEN
        ? 'PERMISSION'
        : status === HttpStatus.CONFLICT
          ? 'CONFLICT'
          : 'VALIDATION';
    throw new OrderException(status, code, category, message);
  }
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
function createOrderCode(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `HH-${date}-${randomBytes(6).toString('hex').toUpperCase()}`;
}
function toMinor(value: string): bigint {
  const [whole, fraction = ''] = value.split('.');
  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0').slice(0, 2));
}
function fromMinor(value: bigint): string {
  return `${value / 100n}.${(value % 100n).toString().padStart(2, '0')}`;
}
function addMoney(left: string, right: string): string {
  return fromMinor(toMinor(left) + toMinor(right));
}
function multiplyMoney(value: string, quantity: number): string {
  return fromMinor(toMinor(value) * BigInt(quantity));
}
