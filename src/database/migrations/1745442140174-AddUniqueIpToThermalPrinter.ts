import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueIpToThermalPrinter1745442140174
  implements MigrationInterface
{
  name = 'AddUniqueIpToThermalPrinter1745442140174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "thermal_printer" ADD CONSTRAINT "UQ_cd20a8ea69e128597672d5c7813" UNIQUE ("ipAddress")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "thermal_printer" DROP CONSTRAINT "UQ_cd20a8ea69e128597672d5c7813"`,
    );
  }
}
