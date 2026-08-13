import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
  type PersistedCustomerOrderSummary,
  type PersistedOrderAggregate,
} from '../../data/order/repositories';
import {
  CustomerOwnerResolutionError,
  CustomerOwnerResolver,
} from '../../domain/commerce-dependencies/customer-owner.resolver';
import type { CustomerOrderListQueryDto } from './order.dto';
import { OrderException } from './order.exception';

type OrderStatus = PersistedOrderAggregate['order']['orderStatus'];
type PaymentStatus = PersistedOrderAggregate['payment']['paymentStatus'];
type PaymentMethod = PersistedOrderAggregate['payment']['paymentMethod'];
type ShippingStatus = PersistedOrderAggregate['shipment']['shippingStatus'];
type ShippingMethod = PersistedOrderAggregate['shipment']['shippingMethod'];

export interface CustomerOrderListItem {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingStatus: ShippingStatus;
  itemCount: number;
  total: string;
  currency: 'VND';
  createdAt: string;
}

export interface CustomerOrderDetail {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingStatus: ShippingStatus;
  shippingMethod: ShippingMethod;
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
  shippingAddress: {
    recipientName: string;
    phone: string;
    countryCode: string | null;
    provinceCity: string | null;
    district: string | null;
    ward: string | null;
    addressLine: string | null;
    note: string | null;
  };
  payment: {
    paymentId: string;
    method: PaymentMethod;
    status: PaymentStatus;
    amount: string;
    currency: 'VND';
    providerReference: string | null;
    paidAt: string | null;
    updatedAt: string;
  };
  shipping: {
    method: ShippingMethod;
    status: ShippingStatus;
    fee: string;
    trackingReference: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
  };
  createdAt: string;
  placedAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CustomerOrderListResult {
  items: CustomerOrderListItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

@Injectable()
export class CustomerOrderService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
    private readonly owners: CustomerOwnerResolver,
  ) {}

  async list(
    auth: AuthenticatedRequestContext,
    query: CustomerOrderListQueryDto,
  ): Promise<CustomerOrderListResult> {
    const owner = await this.resolveOwner(auth);
    const dateFrom = query.dateFrom ? new Date(query.dateFrom) : undefined;
    const dateTo = query.dateTo ? new Date(query.dateTo) : undefined;
    if (dateFrom && dateTo && dateFrom > dateTo) {
      throw new OrderException(
        HttpStatus.BAD_REQUEST,
        'ORDER.DATE_RANGE_INVALID',
        'VALIDATION',
        'Khoảng ngày tạo đơn không hợp lệ.',
      );
    }
    const result = await this.orders.findCustomerPage(owner.customerProfileId, {
      page: query.page,
      pageSize: query.pageSize,
      orderStatus: query.orderStatus,
      paymentStatus: query.paymentStatus,
      shippingStatus: query.shippingStatus,
      dateFrom,
      dateTo,
    });
    const totalPages = Math.ceil(result.totalItems / query.pageSize);
    return {
      items: result.items.map((item) => this.toListItem(item)),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        totalItems: result.totalItems,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    };
  }

  async detail(auth: AuthenticatedRequestContext, orderId: string): Promise<CustomerOrderDetail> {
    const owner = await this.resolveOwner(auth);
    if (!isPositiveIntegerString(orderId)) this.notFound();
    const aggregate = await this.orders.findCustomerById(owner.customerProfileId, orderId);
    if (!aggregate) this.notFound();
    return this.toDetail(aggregate!);
  }

  private toListItem(aggregate: PersistedCustomerOrderSummary): CustomerOrderListItem {
    return {
      orderId: aggregate.order.id,
      orderNumber: aggregate.order.orderCode,
      orderStatus: aggregate.order.orderStatus,
      paymentStatus: aggregate.payment.paymentStatus,
      paymentMethod: aggregate.payment.paymentMethod,
      shippingStatus: aggregate.shipment.shippingStatus,
      itemCount: aggregate.itemCount,
      total: aggregate.order.orderTotal,
      currency: 'VND',
      createdAt: aggregate.order.placedAt.toISOString(),
    };
  }

  private toDetail(aggregate: PersistedOrderAggregate): CustomerOrderDetail {
    const subtotal = aggregate.items.reduce((sum, item) => addMoney(sum, item.lineTotal), '0.00');
    const address = parseAddressSnapshot(aggregate.shippingAddress.addressText);
    return {
      orderId: aggregate.order.id,
      orderNumber: aggregate.order.orderCode,
      orderStatus: aggregate.order.orderStatus,
      paymentStatus: aggregate.payment.paymentStatus,
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
        countryCode: readString(address.countryCode),
        provinceCity: readString(address.provinceCity),
        district: readString(address.district),
        ward: readString(address.ward),
        addressLine: readString(address.addressLine),
        note: aggregate.shippingAddress.deliveryNote,
      },
      payment: {
        paymentId: aggregate.payment.id,
        method: aggregate.payment.paymentMethod,
        status: aggregate.payment.paymentStatus,
        amount: aggregate.payment.paymentAmount,
        currency: 'VND',
        providerReference: aggregate.payment.providerReference,
        paidAt: aggregate.payment.paidAt?.toISOString() ?? null,
        updatedAt: aggregate.payment.updatedAt.toISOString(),
      },
      shipping: {
        method: aggregate.shipment.shippingMethod,
        status: aggregate.shipment.shippingStatus,
        fee: aggregate.shipment.shippingFee,
        trackingReference: aggregate.shipment.trackingReference,
        shippedAt: aggregate.shipment.shippedAt?.toISOString() ?? null,
        deliveredAt: aggregate.shipment.deliveredAt?.toISOString() ?? null,
      },
      createdAt: aggregate.order.createdAt.toISOString(),
      placedAt: aggregate.order.placedAt.toISOString(),
      updatedAt: aggregate.order.updatedAt.toISOString(),
      completedAt: aggregate.order.completedAt?.toISOString() ?? null,
    };
  }

  private async resolveOwner(auth: AuthenticatedRequestContext) {
    try {
      return await this.owners.resolve(auth);
    } catch (error) {
      if (error instanceof CustomerOwnerResolutionError) {
        throw new OrderException(
          HttpStatus.FORBIDDEN,
          'ORDER.ACCESS_DENIED',
          'PERMISSION',
          'Order chỉ dành cho Customer.',
        );
      }
      throw error;
    }
  }

  private notFound(): never {
    throw new OrderException(
      HttpStatus.NOT_FOUND,
      'ORDER.NOT_FOUND',
      'NOT_FOUND',
      'Không tìm thấy đơn hàng.',
    );
  }
}

function isPositiveIntegerString(value: string): boolean {
  return /^[1-9]\d*$/.test(value);
}

function parseAddressSnapshot(value: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(value);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function readString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
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
