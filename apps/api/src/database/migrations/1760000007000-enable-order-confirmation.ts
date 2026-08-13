import type { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableOrderConfirmation1760000007000 implements MigrationInterface {
  name = 'EnableOrderConfirmation1760000007000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `orders` DROP CHECK `chk_orders_status`');
    await queryRunner.query('ALTER TABLE `orders` DROP CHECK `chk_orders_payment_status`');
    await queryRunner.query("ALTER TABLE `orders` ADD CONSTRAINT `chk_orders_status_v2` CHECK (`order_status` IN ('new','confirmed'))");
    await queryRunner.query("ALTER TABLE `orders` ADD CONSTRAINT `chk_orders_payment_status_v2` CHECK (`payment_status_snapshot` IN ('pending','paid','failed','cancelled'))");
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `orders` DROP CHECK `chk_orders_status_v2`');
    await queryRunner.query('ALTER TABLE `orders` DROP CHECK `chk_orders_payment_status_v2`');
    await queryRunner.query("ALTER TABLE `orders` ADD CONSTRAINT `chk_orders_status` CHECK (`order_status` IN ('new'))");
    await queryRunner.query("ALTER TABLE `orders` ADD CONSTRAINT `chk_orders_payment_status` CHECK (`payment_status_snapshot` IN ('pending'))");
  }
}
