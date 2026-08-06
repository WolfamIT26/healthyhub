import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

type TransactionIsolationLevel =
  'READ UNCOMMITTED' | 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE';

@Injectable()
export class TransactionRunner {
  constructor(private readonly dataSource: DataSource) {}

  async run<T>(
    handler: (manager: EntityManager) => Promise<T>,
    isolationLevel: TransactionIsolationLevel = 'READ COMMITTED',
  ): Promise<T> {
    return this.dataSource.transaction(isolationLevel, handler);
  }
}
