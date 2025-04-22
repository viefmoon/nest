import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeliveryAddressToOrder1745352659545
  implements MigrationInterface
{
  name = 'AddDeliveryAddressToOrder1745352659545';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_address" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "delivery_address"`,
    );
  }
}
