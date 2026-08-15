import { Column, Entity, Index } from 'typeorm';

import { BaseAuditEntity } from '../../../database/base-audit.entity';

@Entity({ name: 'media_assets' })
@Index('idx_media_assets_status_type', ['tenantId', 'mediaStatus', 'mediaType'])
@Index('idx_media_assets_purpose_visibility', [
  'tenantId',
  'mediaPurpose',
  'mediaVisibility',
  'mediaStatus',
])
export class MediaAssetEntity extends BaseAuditEntity {
  @Column({ name: 'tenant_id', type: 'bigint', unsigned: true, default: 1 }) tenantId!: string;
  @Column({ name: 'media_name', type: 'varchar', length: 255 }) mediaName!: string;
  @Column({ name: 'media_type', type: 'varchar', length: 32 }) mediaType!:
    'image' | 'document' | 'banner' | 'certificate';
  @Column({ name: 'media_purpose', type: 'varchar', length: 64 }) mediaPurpose!: string;
  @Column({ name: 'storage_reference', type: 'varchar', length: 500 }) storageReference!: string;
  @Column({ name: 'media_visibility', type: 'varchar', length: 32, default: 'private' })
  mediaVisibility!: 'public' | 'private' | 'restricted';
  @Column({ name: 'media_status', type: 'varchar', length: 32, default: 'uploaded' })
  mediaStatus!: 'uploaded' | 'active' | 'hidden' | 'archived' | 'failed';
}
