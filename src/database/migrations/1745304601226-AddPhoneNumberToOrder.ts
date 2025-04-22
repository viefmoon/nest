import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhoneNumberToOrder1745304601226 implements MigrationInterface {
  name = 'AddPhoneNumberToOrder1745304601226';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "phoneNumber" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "phoneNumber"`);
  }
}
