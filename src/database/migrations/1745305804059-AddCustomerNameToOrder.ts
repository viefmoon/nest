import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerNameToOrder1745305804059 implements MigrationInterface {
  name = 'AddCustomerNameToOrder1745305804059';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "customer_name" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customer_name"`);
  }
}
