import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'customer_profiles' })
@Index('uq_customer_profiles_tenant_code', ['tenantId', 'customerCode'], { unique: true })
@Index('uq_customer_profiles_tenant_user', ['tenantId', 'userAccountId'], { unique: true })
@Index('idx_customer_profiles_status_created', ['tenantId', 'customerStatus', 'createdAt'])
export class CustomerProfileEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'user_account_id', type: 'bigint', unsigned: true, nullable: true })
  userAccountId!: string | null;
  @Column({ name: 'customer_code', type: 'varchar', length: 64 }) customerCode!: string;
  @Column({ name: 'full_name', type: 'varchar', length: 255 }) fullName!: string;
  @Column({ name: 'contact_info', type: 'json', nullable: true }) contactInfo!: {
    email?: string;
    phone?: string;
  } | null;
  @Column({ name: 'customer_status', type: 'varchar', length: 32, default: 'active' })
  customerStatus!: 'active' | 'guest' | 'blocked' | 'archived';
  @Column({ name: 'consent_state', type: 'varchar', length: 32, default: 'unknown' })
  consentState!: 'unknown' | 'granted' | 'denied';
  @Column({ name: 'marketing_opt_in_status', type: 'varchar', length: 32, default: 'not_opted_in' })
  marketingOptInStatus!: 'not_opted_in' | 'opted_in' | 'opted_out';
}
