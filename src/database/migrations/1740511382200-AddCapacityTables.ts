import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCapacityTables1740511382200 implements MigrationInterface {
  name = 'AddCapacityTables1740511382200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "table" ADD "capacity" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "table" DROP COLUMN "capacity"`);
  }
}
