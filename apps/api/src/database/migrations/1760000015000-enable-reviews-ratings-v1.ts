import type { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableReviewsRatingsV11760000015000 implements MigrationInterface {
  name = 'EnableReviewsRatingsV11760000015000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE product_reviews (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      tenant_id BIGINT UNSIGNED NOT NULL DEFAULT 1,
      customer_profile_id BIGINT UNSIGNED NOT NULL,
      product_id BIGINT UNSIGNED NOT NULL,
      order_id BIGINT UNSIGNED NOT NULL,
      rating TINYINT UNSIGNED NOT NULL,
      review_content TEXT NOT NULL,
      review_status VARCHAR(32) NOT NULL DEFAULT 'published',
      submitted_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      published_at DATETIME(3) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      deleted_at DATETIME(3) NULL,
      created_by BIGINT UNSIGNED NULL,
      updated_by BIGINT UNSIGNED NULL,
      deleted_by BIGINT UNSIGNED NULL,
      version INT UNSIGNED NOT NULL DEFAULT 1,
      PRIMARY KEY (id),
      CONSTRAINT uq_product_reviews_tenant_order_product UNIQUE (tenant_id, order_id, product_id),
      CONSTRAINT fk_product_reviews_customer FOREIGN KEY (customer_profile_id) REFERENCES customer_profiles (id) ON DELETE RESTRICT,
      CONSTRAINT fk_product_reviews_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT,
      CONSTRAINT fk_product_reviews_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT,
      CONSTRAINT fk_product_reviews_created_by FOREIGN KEY (created_by) REFERENCES user_accounts (id) ON DELETE SET NULL,
      CONSTRAINT fk_product_reviews_updated_by FOREIGN KEY (updated_by) REFERENCES user_accounts (id) ON DELETE SET NULL,
      CONSTRAINT fk_product_reviews_deleted_by FOREIGN KEY (deleted_by) REFERENCES user_accounts (id) ON DELETE SET NULL,
      CONSTRAINT chk_product_reviews_rating CHECK (rating BETWEEN 1 AND 5),
      CONSTRAINT chk_product_reviews_content CHECK (CHAR_LENGTH(TRIM(review_content)) BETWEEN 3 AND 2000),
      CONSTRAINT chk_product_reviews_status CHECK (review_status IN ('published','hidden','rejected')),
      INDEX idx_product_reviews_public (tenant_id, product_id, review_status, published_at),
      INDEX idx_product_reviews_customer (tenant_id, customer_profile_id, submitted_at),
      INDEX idx_product_reviews_order (tenant_id, order_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `product_reviews`');
  }
}
