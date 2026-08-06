import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
  Column,
} from 'typeorm';

export abstract class BaseAuditEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 3 })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 3 })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', precision: 3, nullable: true })
  deletedAt!: Date | null;

  @Column({ name: 'created_by', type: 'bigint', unsigned: true, nullable: true })
  createdBy!: string | null;

  @Column({ name: 'updated_by', type: 'bigint', unsigned: true, nullable: true })
  updatedBy!: string | null;

  @Column({ name: 'deleted_by', type: 'bigint', unsigned: true, nullable: true })
  deletedBy!: string | null;

  @VersionColumn({ type: 'int', unsigned: true, default: 1 })
  version!: number;
}
