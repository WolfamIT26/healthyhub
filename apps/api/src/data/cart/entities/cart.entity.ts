import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'carts' })
@Index('uq_carts_tenant_customer_status', ['tenantId', 'customerProfileId', 'cartStatus'], {
  unique: true,
})
@Index('idx_carts_customer_status', ['tenantId', 'customerProfileId', 'cartStatus'])
@Index('idx_carts_status_updated', ['tenantId', 'cartStatus', 'updatedAt'])
export class CartEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'customer_profile_id', type: 'bigint', unsigned: true })
  customerProfileId!: string;
  @Column({ name: 'cart_owner_type', type: 'varchar', length: 32, default: 'customer' })
  cartOwnerType!: 'customer';
  @Column({ name: 'guest_session_reference', type: 'varchar', length: 191, nullable: true })
  guestSessionReference!: null;
  @Column({ name: 'cart_status', type: 'varchar', length: 32, default: 'active' }) cartStatus!:
    'active' | 'checked_out' | 'abandoned' | 'expired';
  @Column({ name: 'cart_validation_status', type: 'varchar', length: 32, default: 'not_validated' })
  cartValidationStatus!: 'valid' | 'invalid' | 'not_validated';
  @Column({ name: 'last_validated_at', type: 'datetime', precision: 3, nullable: true })
  lastValidatedAt!: Date | null;
}
