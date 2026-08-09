import { Injectable } from '@nestjs/common';
import { DataSource, type EntityManager } from 'typeorm';

import { PaymentProviderEventEntity } from '../entities';
import type { ClaimPaymentProviderEventInput, PaymentProviderEventClaim, PaymentProviderEventRepository } from './payment-provider-event.repository';

@Injectable()
export class TypeOrmPaymentProviderEventRepository implements PaymentProviderEventRepository {
  constructor(private readonly dataSource: DataSource) {}

  async claim(input: ClaimPaymentProviderEventInput): Promise<PaymentProviderEventClaim> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const repository = manager.getRepository(PaymentProviderEventEntity);
        let event = await repository.findOne({
          where: { tenantId: '1', provider: input.provider, providerEventId: input.providerEventId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!event) {
          event = await repository.save(repository.create({
            tenantId: '1', provider: input.provider, providerEventId: input.providerEventId,
            eventType: input.eventType, paymentId: null, providerReference: input.providerReference,
            payloadHash: input.payloadHash, processingStatus: 'received', receivedAt: input.receivedAt,
            processingStartedAt: null, processedAt: null, failureCode: null,
          }));
        } else if (event.payloadHash !== input.payloadHash || event.eventType !== input.eventType || event.providerReference !== input.providerReference) {
          return { claimed: false, event };
        }
        if (event.processingStatus !== 'received' && event.processingStatus !== 'failed') return { claimed: false, event };
        event.processingStatus = 'processing';
        event.processingStartedAt = new Date();
        event.failureCode = null;
        return { claimed: true, event: await repository.save(event) };
      });
    } catch (error) {
      if (!isConcurrencyConflict(error)) throw error;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const duplicate = await this.findByProviderEvent(input.provider, input.providerEventId);
        if (duplicate) return { claimed: false, event: duplicate };
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      throw error;
    }
  }

  async completeWithBusinessEffect(eventId: string, paymentId: string, effect: (manager: EntityManager) => Promise<void>): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(PaymentProviderEventEntity);
      const event = await repository.findOne({ where: { id: eventId }, lock: { mode: 'pessimistic_write' } });
      if (!event || event.processingStatus !== 'processing') throw new Error('Payment provider event không ở trạng thái processing.');
      await effect(manager);
      event.paymentId = paymentId;
      event.processingStatus = 'processed';
      event.processedAt = new Date();
      event.failureCode = null;
      await repository.save(event);
    });
  }

  async markFailed(eventId: string, failureCode: string): Promise<void> {
    await this.setTerminalStatus(eventId, 'failed', failureCode);
  }

  async markRejected(eventId: string, failureCode: string): Promise<void> {
    await this.setTerminalStatus(eventId, 'rejected', failureCode);
  }

  findByProviderEvent(provider: string, providerEventId: string) {
    return this.dataSource.getRepository(PaymentProviderEventEntity).findOneBy({ tenantId: '1', provider, providerEventId });
  }

  private async setTerminalStatus(eventId: string, status: 'failed' | 'rejected', failureCode: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(PaymentProviderEventEntity);
      const event = await repository.findOne({ where: { id: eventId }, lock: { mode: 'pessimistic_write' } });
      if (!event || event.processingStatus !== 'processing') throw new Error('Payment provider event không ở trạng thái processing.');
      event.processingStatus = status;
      event.processedAt = new Date();
      event.failureCode = failureCode.slice(0, 100);
      await repository.save(event);
    });
  }
}

function isConcurrencyConflict(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('code' in error)) return false;
  return error.code === 'ER_DUP_ENTRY' || error.code === 'ER_LOCK_DEADLOCK';
}
