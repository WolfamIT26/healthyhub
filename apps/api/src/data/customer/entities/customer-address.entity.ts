import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'customer_addresses' })
@Index('idx_customer_addresses_customer_status', [
  'tenantId',
  'customerProfileId',
  'addressStatus',
  'updatedAt',
])
@Index(
  'uq_customer_addresses_idempotency',
  ['tenantId', 'customerProfileId', 'idempotencyKeyHash'],
  { unique: true },
)
export class CustomerAddressEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 })
  tenantId!: string;

  @Column({ name: 'customer_profile_id', type: 'bigint', unsigned: true })
  customerProfileId!: string;

  @Column({ name: 'recipient_name', type: 'varchar', length: 255 })
  recipientName!: string;

  @Column({ type: 'varchar', length: 32 })
  phone!: string;

  @Column({ name: 'country_code', type: 'char', length: 2, default: 'VN' })
  countryCode!: 'VN';

  @Column({ name: 'province_city', type: 'varchar', length: 150 })
  provinceCity!: string;

  @Column({ type: 'varchar', length: 150 })
  district!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  ward!: string | null;

  @Column({ name: 'address_line', type: 'varchar', length: 500 })
  addressLine!: string;

  @Column({ name: 'delivery_note', type: 'varchar', length: 500, nullable: true })
  note!: string | null;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault!: boolean;

  @Column({ name: 'address_status', type: 'varchar', length: 32, default: 'active' })
  addressStatus!: 'active' | 'archived';

  @Column({ name: 'idempotency_key_hash', type: 'char', length: 64, nullable: true })
  idempotencyKeyHash!: string | null;

  @Column({ name: 'request_hash', type: 'char', length: 64, nullable: true })
  requestHash!: string | null;
}
