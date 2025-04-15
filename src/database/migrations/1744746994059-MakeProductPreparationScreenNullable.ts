import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeProductPreparationScreenNullable1744746994059
  implements MigrationInterface
{
  name = 'MakeProductPreparationScreenNullable1744746994059';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_c3d9d0f7b1a7312a1926307b4bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "preparationScreenId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_c3d9d0f7b1a7312a1926307b4bf" FOREIGN KEY ("preparationScreenId") REFERENCES "preparation_screens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_c3d9d0f7b1a7312a1926307b4bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "preparationScreenId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_c3d9d0f7b1a7312a1926307b4bf" FOREIGN KEY ("preparationScreenId") REFERENCES "preparation_screens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
