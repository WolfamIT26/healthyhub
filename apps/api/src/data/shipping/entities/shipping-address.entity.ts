import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'shipping_addresses' })
@Index('uq_shipping_addresses_tenant_shipment_status', ['tenantId', 'shipmentId', 'addressSnapshotStatus'], { unique: true })
export class ShippingAddressEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'shipment_id', type: 'bigint', unsigned: true }) shipmentId!: string;
  @Column({ name: 'customer_address_id', type: 'bigint', unsigned: true, nullable: true }) customerAddressId!: null;
  @Column({ name: 'recipient_name', type: 'varchar', length: 255 }) recipientName!: string;
  @Column({ name: 'recipient_phone', type: 'varchar', length: 32 }) recipientPhone!: string;
  @Column({ name: 'address_text', type: 'text' }) addressText!: string;
  @Column({ name: 'delivery_note', type: 'varchar', length: 500, nullable: true }) deliveryNote!: string | null;
  @Column({ name: 'address_snapshot_status', type: 'varchar', length: 32, default: 'active' }) addressSnapshotStatus!: 'active';
}
