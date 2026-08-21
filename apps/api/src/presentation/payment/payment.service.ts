import { createHash } from 'node:crypto';

import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import type { AuthenticatedRequestContext } from '../../common/types/request-with-context';
import { InventoryStockMutationRepository } from '../../data/inventory/repositories';
import {
  PAYMENT_PROVIDER_EVENT_REPOSITORY,
  type PaymentProviderEventClaim,
  type PaymentProviderEventRepository,
} from '../../data/payment/repositories';
import { OrderEntity } from '../../data/order/entities';
import { PaymentAttemptEntity, PaymentEntity } from '../../data/payment/entities';
import type { HealthyHubEnvironment } from '../../config/environment';
import { CustomerOwnerResolver } from '../../domain/commerce-dependencies/customer-owner.resolver';
import { OrderPaymentMappingPolicy } from '../../domain/payment/order-payment-mapping.policy';
import {
  PaymentLifecyclePolicy,
  type PaymentStatus,
} from '../../domain/payment/payment-lifecycle.policy';
import {
  PaymentMethodReader,
  UnsupportedPaymentMethodError,
} from '../../domain/payment/payment-method.reader';
import { PaymentProviderRegistry } from '../../domain/payment/payment-provider.registry';
import { PaymentProviderNotConfiguredError } from '../../domain/payment/payment-provider.gateway';
import {
  VnpayPaymentGateway,
  VnpayPaymentProviderError,
  VnpayPaymentSignatureError,
} from '../../gateways/payment/vnpay-payment.gateway';
import { PaymentException } from './payment.exception';
import { CreatePaymentIntentDto } from './payment.dto';

export interface PaymentMethodReadModel {
  code: 'cod' | 'vnpay';
  name: string;
  enabled: boolean;
  captureRequired: boolean;
  initialPaymentStatus: 'pending';
}

export interface PaymentSummary {
  id: string;
  orderId: string;
  method: 'cod' | 'vnpay';
  status: PaymentStatus;
  amount: string;
  currency: 'VND';
  providerReference: string | null;
  redirectUrl?: string | null;
  updatedAt: string;
}

interface PaymentAggregate {
  order: OrderEntity;
  payment: PaymentEntity;
  attempt: PaymentAttemptEntity | null;
}

@Injectable()
export class PaymentService {
  constructor(
    @Inject('HealthyHubEnvironment') private readonly env: HealthyHubEnvironment,
    private readonly dataSource: DataSource,
    private readonly owners: CustomerOwnerResolver,
    private readonly methods: PaymentMethodReader,
    private readonly registry: PaymentProviderRegistry,
    private readonly lifecycle: PaymentLifecyclePolicy,
    private readonly mapping: OrderPaymentMappingPolicy,
    @Inject(PAYMENT_PROVIDER_EVENT_REPOSITORY)
    private readonly providerEvents: PaymentProviderEventRepository,
    private readonly stockMutations: InventoryStockMutationRepository,
  ) {}

  listMethods(): readonly PaymentMethodReadModel[] {
    const decision = this.registry.getDecision('vnpay');
    return this.methods
      .listExecutableMethods()
      .map((method) =>
        method.code === 'vnpay' ? { ...method, enabled: decision.gatewayConfigured } : method,
      );
  }

  async createIntent(
    auth: AuthenticatedRequestContext,
    idempotencyKey: string | undefined,
    input: CreatePaymentIntentDto,
    ipAddress?: string,
  ): Promise<PaymentSummary> {
    this.assertIdempotencyKey(idempotencyKey);
    const owner = await this.owners.resolve(auth);
    const order = await this.findOrderForOwner(input.orderId, owner.customerProfileId);
    const payment = await this.findPaymentByOrderId(order.id);
    if (!payment) {
      throw new PaymentException(
        HttpStatus.NOT_FOUND,
        'PAYMENT_TRANSACTION_NOT_FOUND',
        'NOT_FOUND',
        'Không tìm thấy payment.',
      );
    }
    if (payment.paymentMethod !== 'vnpay') {
      throw new PaymentException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'PAYMENT_PROVIDER_REJECTED',
        'BUSINESS',
        'Order này không được cấu hình cho VNPAY.',
      );
    }
    if (payment.paymentStatus !== 'pending') {
      throw new PaymentException(
        HttpStatus.CONFLICT,
        'PAYMENT_ALREADY_COMPLETED',
        'CONFLICT',
        'Payment đã hoàn tất hoặc không còn ở trạng thái chờ.',
      );
    }
    this.assertPersistedAmounts(order, payment);
    const method = this.methods.requireExecutableMethod(input.paymentMethod);
    if (method.code !== 'vnpay') {
      throw new PaymentException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'PAYMENT_PROVIDER_REJECTED',
        'BUSINESS',
        'HealthyHub V1 chỉ hỗ trợ COD và VNPAY.',
      );
    }
    const providerDecision = this.registry.getDecision('vnpay');
    if (!providerDecision.gatewayConfigured) {
      throw new PaymentException(
        HttpStatus.SERVICE_UNAVAILABLE,
        'PAYMENT_PROVIDER_UNAVAILABLE',
        'INTEGRATION',
        'VNPAY sandbox chưa được cấu hình.',
        true,
      );
    }
    const gateway = this.registry.resolve('vnpay') as VnpayPaymentGateway;
    const idempotencyHash = hash(idempotencyKey!);
    const existingAttempt = await this.findAttemptByIdempotencyKey(payment.id, idempotencyHash);
    if (existingAttempt) {
      const replay = await gateway.createPayment({
        paymentId: payment.id,
        orderId: order.id,
        providerReference: existingAttempt.providerReference,
        amount: order.orderTotal,
        currency: 'VND',
        idempotencyKey: idempotencyKey!,
        returnUrl: this.buildReturnUrl(payment.id, existingAttempt.providerReference),
        cancelUrl: this.buildReturnUrl(payment.id, existingAttempt.providerReference),
        createdAt: existingAttempt.createdAt,
        expiresAt: existingAttempt.expiresAt,
        orderInfo: `Thanh toán đơn ${order.orderCode}`,
        ipAddress,
      });
      return this.toSummary(payment, replay.redirectUrl);
    }

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 15 * 60 * 1000);
    const providerReference = buildProviderReference(payment.id, idempotencyHash);
    const attempt = await this.dataSource.transaction(async (manager) => {
      const attemptRepository = manager.getRepository(PaymentAttemptEntity);
      const paymentRepository = manager.getRepository(PaymentEntity);
      const nextAttempt = attemptRepository.create({
        tenantId: '1',
        paymentId: payment.id,
        provider: 'vnpay',
        providerReference,
        providerTransactionNo: null,
        amount: order.orderTotal,
        currency: 'VND',
        attemptStatus: 'pending',
        idempotencyKeyHash: idempotencyHash,
        expiresAt,
        completedAt: null,
        createdBy: auth.userAccountId,
        updatedBy: auth.userAccountId,
      });
      try {
        const savedAttempt = await attemptRepository.save(nextAttempt);
        payment.providerReference = providerReference;
        payment.updatedBy = auth.userAccountId;
        await paymentRepository.save(payment);
        return savedAttempt;
      } catch (error) {
        const retry = await attemptRepository.findOneBy({
          tenantId: '1',
          paymentId: payment.id,
          idempotencyKeyHash: idempotencyHash,
        });
        if (retry) return retry;
        throw error;
      }
    });

    const redirect = await gateway.createPayment({
      paymentId: payment.id,
      orderId: order.id,
      providerReference: attempt.providerReference,
      amount: order.orderTotal,
      currency: 'VND',
      idempotencyKey: idempotencyKey!,
      returnUrl: this.buildReturnUrl(payment.id, attempt.providerReference),
      cancelUrl: this.buildReturnUrl(payment.id, attempt.providerReference),
      createdAt: attempt.createdAt,
      expiresAt: attempt.expiresAt,
      orderInfo: `Thanh toán đơn ${order.orderCode}`,
      ipAddress,
    });

    return this.toSummary(payment, redirect.redirectUrl);
  }

  async getStatus(auth: AuthenticatedRequestContext, paymentId: string): Promise<PaymentSummary> {
    const owner = await this.owners.resolve(auth);
    const aggregate = await this.findAggregate(paymentId);
    if (!aggregate || aggregate.order.customerProfileId !== owner.customerProfileId) {
      throw new PaymentException(
        HttpStatus.NOT_FOUND,
        'PAYMENT_TRANSACTION_NOT_FOUND',
        'NOT_FOUND',
        'Không tìm thấy payment.',
      );
    }
    return this.toSummary(aggregate.payment);
  }

  async processVnpayReturn(
    auth: AuthenticatedRequestContext,
    query: Readonly<Record<string, string | string[] | undefined>>,
  ): Promise<PaymentSummary> {
    const owner = await this.owners.resolve(auth);
    const paymentId = readQueryValue(query.paymentId);
    const providerParams = extractProviderParams(query);
    try {
      const gateway = this.registry.resolve('vnpay') as VnpayPaymentGateway;
      const verified = await gateway.verifyWebhook(Buffer.alloc(0), {}, providerParams);
      const aggregate = await this.findAggregateByProviderReference(verified.providerReference);
      if (!aggregate) {
        throw new PaymentException(
          HttpStatus.NOT_FOUND,
          'PAYMENT_TRANSACTION_NOT_FOUND',
          'NOT_FOUND',
          'Không tìm thấy payment.',
        );
      }
      if (aggregate.order.customerProfileId !== owner.customerProfileId) {
        throw new PaymentException(
          HttpStatus.FORBIDDEN,
          'PAYMENT_ACCESS_DENIED',
          'PERMISSION',
          'Không có quyền truy cập payment này.',
        );
      }
      if (paymentId && paymentId !== aggregate.payment.id) {
        throw new PaymentException(
          HttpStatus.UNPROCESSABLE_ENTITY,
          'PAYMENT_REFERENCE_MISMATCH',
          'VALIDATION',
          'Tham chiếu payment không khớp.',
        );
      }
      this.assertProviderOutcomeMatches(aggregate, verified);
      return this.toSummary(aggregate.payment);
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async processVnpayIpn(
    query: Readonly<Record<string, string | string[] | undefined>>,
  ): Promise<{ rspCode: string; message: string }> {
    await this.processVnpaySignal(query);
    return { rspCode: '00', message: 'Confirm Success' };
  }

  private async processVnpaySignal(
    query: Readonly<Record<string, string | string[] | undefined>>,
  ): Promise<PaymentSummary> {
    const providerParams = extractProviderParams(query);
    const gateway = this.registry.resolve('vnpay') as VnpayPaymentGateway;
    let claim: PaymentProviderEventClaim | null = null;
    try {
      const verified = await gateway.verifyWebhook(Buffer.alloc(0), {}, providerParams);
      const aggregate = await this.findAggregateByProviderReference(verified.providerReference);
      if (!aggregate) {
        throw new PaymentException(
          HttpStatus.NOT_FOUND,
          'PAYMENT_TRANSACTION_NOT_FOUND',
          'NOT_FOUND',
          'Không tìm thấy payment.',
        );
      }

      const payloadHash = hash(canonicalProviderPayload(providerParams));
      claim = await this.providerEvents.claim({
        provider: verified.provider,
        providerEventId: verified.eventId,
        eventType: verified.eventType,
        providerReference: verified.providerReference,
        payloadHash,
        receivedAt: verified.verifiedAt,
      });
      if (!claim.claimed) {
        const exactDuplicate =
          claim.event.payloadHash === payloadHash &&
          claim.event.eventType === verified.eventType &&
          claim.event.providerReference === verified.providerReference;
        if (exactDuplicate && claim.event.processingStatus === 'processed') {
          return this.toSummary(aggregate.payment);
        }
        throw new PaymentException(
          HttpStatus.CONFLICT,
          'PAYMENT_RECONCILIATION_REQUIRED',
          'INTEGRATION',
          'Payment event đang xử lý hoặc không khớp dữ liệu đã nhận.',
          true,
        );
      }

      await this.providerEvents.completeWithBusinessEffect(
        claim.event.id,
        aggregate.payment.id,
        async (manager) => {
          await this.applyProviderOutcome(
            manager,
            aggregate.payment.id,
            verified.providerReference,
            verified,
            undefined,
          );
        },
      );
      const refreshed = await this.findAggregate(aggregate.payment.id);
      if (!refreshed) {
        throw new PaymentException(
          HttpStatus.NOT_FOUND,
          'PAYMENT_TRANSACTION_NOT_FOUND',
          'NOT_FOUND',
          'Không tìm thấy payment.',
        );
      }
      return this.toSummary(refreshed.payment);
    } catch (error) {
      if (claim?.claimed) {
        if (error instanceof VnpayPaymentSignatureError) {
          await this.providerEvents.markRejected(claim.event.id, error.code);
        } else {
          await this.providerEvents.markFailed(claim.event.id, paymentFailureCode(error));
        }
      }
      throw this.normalizeError(error);
    }
  }

  private async applyProviderOutcome(
    manager: EntityManager,
    paymentId: string,
    providerReference: string,
    outcome:
      | Awaited<ReturnType<VnpayPaymentGateway['verifyWebhook']>>
      | Awaited<ReturnType<VnpayPaymentGateway['queryPayment']>>,
    actorUserAccountId: string | undefined,
  ): Promise<void> {
    const paymentRepository = manager.getRepository(PaymentEntity);
    const attemptRepository = manager.getRepository(PaymentAttemptEntity);
    const orderRepository = manager.getRepository(OrderEntity);
    const payment = await paymentRepository.findOne({
      where: { tenantId: '1', id: paymentId },
      lock: { mode: 'pessimistic_write' },
    });
    const attempt = await attemptRepository.findOne({
      where: { tenantId: '1', paymentId, provider: 'vnpay', providerReference },
      lock: { mode: 'pessimistic_write' },
    });
    if (!payment || !attempt) {
      throw new PaymentException(
        HttpStatus.NOT_FOUND,
        'PAYMENT_TRANSACTION_NOT_FOUND',
        'NOT_FOUND',
        'Không tìm thấy payment attempt.',
      );
    }
    const order = await orderRepository.findOne({
      where: { tenantId: '1', id: payment.orderId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!order) {
      throw new PaymentException(
        HttpStatus.NOT_FOUND,
        'PAYMENT_TRANSACTION_NOT_FOUND',
        'NOT_FOUND',
        'Không tìm thấy Order.',
      );
    }
    const aggregate = { order, payment, attempt };
    this.assertProviderOutcomeMatches(aggregate, outcome);

    const nextStatus = normalizeVnpayStatus(outcome.status);
    if (nextStatus !== 'pending') {
      this.lifecycle.assertTransition(aggregate.payment.paymentStatus, nextStatus);
    }

    if (nextStatus === 'paid') {
      await this.stockMutations.consumeForOrder(
        manager,
        aggregate.order.id,
        actorUserAccountId ?? null,
        aggregate.order.tenantId,
      );
    } else if (nextStatus === 'failed' || nextStatus === 'cancelled') {
      await this.stockMutations.releaseForOrder(
        manager,
        aggregate.order.id,
        actorUserAccountId ?? null,
        aggregate.order.tenantId,
      );
    }

    aggregate.payment.providerReference = outcome.providerReference;
    aggregate.payment.updatedBy = actorUserAccountId ?? aggregate.payment.updatedBy;

    if (nextStatus !== 'pending') {
      aggregate.attempt.providerTransactionNo =
        outcome.providerTransactionNo ?? aggregate.attempt.providerTransactionNo;
      aggregate.attempt.attemptStatus = nextStatus;
      aggregate.attempt.completedAt = new Date();
      aggregate.attempt.updatedBy = actorUserAccountId ?? aggregate.attempt.updatedBy;
    }
    await attemptRepository.save(aggregate.attempt);

    if (nextStatus === 'paid') {
      aggregate.payment.paymentStatus = 'paid';
      aggregate.payment.paidAt ??= outcome.occurredAt ?? new Date();
      aggregate.order.paymentStatusSnapshot = 'paid';
      if (
        this.mapping.effectFor(nextStatus) === 'confirm_if_placed' &&
        aggregate.order.orderStatus === 'new'
      ) {
        aggregate.order.orderStatus = 'confirmed';
        aggregate.order.updatedBy = actorUserAccountId ?? aggregate.order.updatedBy;
      }
    } else if (nextStatus === 'failed') {
      aggregate.payment.paymentStatus = 'failed';
      aggregate.order.paymentStatusSnapshot = 'failed';
    } else if (nextStatus === 'cancelled') {
      aggregate.payment.paymentStatus = 'cancelled';
      aggregate.order.paymentStatusSnapshot = 'cancelled';
    }

    await paymentRepository.save(aggregate.payment);
    await orderRepository.save(aggregate.order);
  }

  private async findOrderForOwner(orderId: string, customerProfileId: string) {
    const order = await this.dataSource
      .getRepository(OrderEntity)
      .findOneBy({ tenantId: '1', id: orderId, customerProfileId });
    if (!order) {
      throw new PaymentException(
        HttpStatus.NOT_FOUND,
        'PAYMENT_TRANSACTION_NOT_FOUND',
        'NOT_FOUND',
        'Không tìm thấy Order.',
      );
    }
    return order;
  }

  private async findPaymentByOrderId(orderId: string) {
    return this.dataSource.getRepository(PaymentEntity).findOneBy({ tenantId: '1', orderId });
  }

  private async findAttemptByIdempotencyKey(paymentId: string, idempotencyKeyHash: string) {
    return this.dataSource
      .getRepository(PaymentAttemptEntity)
      .findOneBy({ tenantId: '1', paymentId, idempotencyKeyHash });
  }

  private async findAggregate(paymentId: string): Promise<PaymentAggregate | null> {
    const payment = await this.dataSource
      .getRepository(PaymentEntity)
      .findOneBy({ tenantId: '1', id: paymentId });
    if (!payment) return null;
    const order = await this.dataSource
      .getRepository(OrderEntity)
      .findOneBy({ tenantId: '1', id: payment.orderId });
    if (!order) return null;
    const attempt = await this.dataSource.getRepository(PaymentAttemptEntity).findOne({
      where: { tenantId: '1', paymentId: payment.id },
      order: { createdAt: 'DESC' },
    });
    return { order, payment, attempt: attempt ?? null };
  }

  private async findAggregateByProviderReference(
    providerReference: string,
  ): Promise<PaymentAggregate | null> {
    const attempt = await this.dataSource.getRepository(PaymentAttemptEntity).findOneBy({
      tenantId: '1',
      provider: 'vnpay',
      providerReference,
    });
    if (!attempt) return null;
    const payment = await this.dataSource.getRepository(PaymentEntity).findOneBy({
      tenantId: '1',
      id: attempt.paymentId,
    });
    if (!payment) return null;
    const order = await this.dataSource.getRepository(OrderEntity).findOneBy({
      tenantId: '1',
      id: payment.orderId,
    });
    return order ? { order, payment, attempt } : null;
  }

  private assertPersistedAmounts(order: OrderEntity, payment: PaymentEntity): void {
    if (order.orderTotal !== payment.paymentAmount) {
      throw new PaymentException(
        HttpStatus.CONFLICT,
        'PAYMENT_AMOUNT_MISMATCH',
        'VALIDATION',
        'Payment amount không khớp với Order đã lưu.',
      );
    }
  }

  private assertProviderOutcomeMatches(
    aggregate: PaymentAggregate,
    outcome:
      | Awaited<ReturnType<VnpayPaymentGateway['verifyWebhook']>>
      | Awaited<ReturnType<VnpayPaymentGateway['queryPayment']>>,
  ): void {
    if (!aggregate.attempt || aggregate.attempt.providerReference !== outcome.providerReference) {
      throw new PaymentException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'PAYMENT_REFERENCE_MISMATCH',
        'VALIDATION',
        'Tham chiếu VNPAY không khớp với payment attempt.',
      );
    }
    if (
      aggregate.order.orderTotal !== outcome.amount ||
      aggregate.payment.paymentAmount !== outcome.amount ||
      aggregate.attempt.amount !== outcome.amount
    ) {
      throw new PaymentException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'PAYMENT_AMOUNT_MISMATCH',
        'VALIDATION',
        'Số tiền thanh toán không khớp với Order đã lưu.',
      );
    }
    if (outcome.currency !== 'VND' || aggregate.attempt.currency !== 'VND') {
      throw new PaymentException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'PAYMENT_AMOUNT_MISMATCH',
        'VALIDATION',
        'Tiền tệ thanh toán không khớp.',
      );
    }
  }

  private toSummary(payment: PaymentEntity, redirectUrl?: string | null): PaymentSummary {
    return {
      id: payment.id,
      orderId: payment.orderId,
      method: payment.paymentMethod,
      status: payment.paymentStatus,
      amount: payment.paymentAmount,
      currency: 'VND',
      providerReference: payment.providerReference,
      redirectUrl: redirectUrl ?? null,
      updatedAt: payment.updatedAt.toISOString(),
    };
  }

  private buildReturnUrl(paymentId: string, providerReference: string): string {
    const url = new URL(this.env.payment.vnpay.returnUrl);
    url.searchParams.set('paymentId', paymentId);
    url.searchParams.set('providerReference', providerReference);
    return url.toString();
  }

  private assertIdempotencyKey(
    idempotencyKey: string | undefined,
  ): asserts idempotencyKey is string {
    if (!idempotencyKey?.trim()) {
      throw new PaymentException(
        HttpStatus.BAD_REQUEST,
        'PAYMENT_IDEMPOTENCY_KEY_REQUIRED',
        'VALIDATION',
        'X-Idempotency-Key là bắt buộc.',
      );
    }
  }

  private normalizeError(error: unknown): PaymentException {
    if (error instanceof PaymentException) return error;
    if (error instanceof PaymentProviderNotConfiguredError) {
      return new PaymentException(
        HttpStatus.SERVICE_UNAVAILABLE,
        'PAYMENT_PROVIDER_UNAVAILABLE',
        'INTEGRATION',
        error.message,
        true,
      );
    }
    if (error instanceof VnpayPaymentProviderError) {
      return new PaymentException(
        HttpStatus.SERVICE_UNAVAILABLE,
        'PAYMENT_PROVIDER_UNAVAILABLE',
        'INTEGRATION',
        error.message,
        true,
      );
    }
    if (error instanceof VnpayPaymentSignatureError) {
      return new PaymentException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        error.code,
        'VALIDATION',
        error.message,
      );
    }
    if (error instanceof UnsupportedPaymentMethodError) {
      return new PaymentException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'PAYMENT_PROVIDER_REJECTED',
        'VALIDATION',
        error.message,
      );
    }
    if (error instanceof Error) {
      return new PaymentException(
        HttpStatus.CONFLICT,
        'PAYMENT_RECONCILIATION_REQUIRED',
        'INTEGRATION',
        error.message,
        true,
      );
    }
    return new PaymentException(
      HttpStatus.CONFLICT,
      'PAYMENT_RECONCILIATION_REQUIRED',
      'INTEGRATION',
      'Thanh toán cần được đối soát lại.',
      true,
    );
  }
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function buildProviderReference(paymentId: string, idempotencyHash: string): string {
  return `HHVNP${paymentId}${idempotencyHash.slice(0, 16)}`;
}

function extractProviderParams(
  query: Readonly<Record<string, string | string[] | undefined>>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(query)
      .filter(([key]) => key.startsWith('vnp_'))
      .map(([key, value]) => [key, Array.isArray(value) ? (value[0] ?? '') : (value ?? '')]),
  );
}

function readQueryValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function normalizeVnpayStatus(status: PaymentStatus): 'pending' | 'paid' | 'failed' | 'cancelled' {
  if (status === 'paid' || status === 'failed' || status === 'cancelled' || status === 'pending') {
    return status;
  }
  return 'pending';
}

function canonicalProviderPayload(params: Readonly<Record<string, string>>): string {
  return new URLSearchParams(
    Object.entries(params).sort(([left], [right]) => left.localeCompare(right)),
  ).toString();
}

function paymentFailureCode(error: unknown): string {
  if (error instanceof PaymentException) {
    const response = error.getResponse();
    if (typeof response === 'object' && response !== null && 'code' in response) {
      const code = (response as Record<string, unknown>).code;
      if (typeof code === 'string') return code;
    }
  }
  if (error instanceof Error && 'code' in error && typeof error.code === 'string') {
    return error.code;
  }
  return 'PAYMENT_RECONCILIATION_REQUIRED';
}
