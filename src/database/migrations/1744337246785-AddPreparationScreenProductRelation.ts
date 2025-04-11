import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPreparationScreenProductRelation1744337246785
  implements MigrationInterface
{
  name = 'AddPreparationScreenProductRelation1744337246785';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "preparation_screen_product" ("preparation_screen_id" uuid NOT NULL, "product_id" uuid NOT NULL, CONSTRAINT "PK_a7affef7482beb578477f4ecda2" PRIMARY KEY ("preparation_screen_id", "product_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2dd678a88d38616bcfd93d51b3" ON "preparation_screen_product" ("preparation_screen_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef1a21aeb4617b2db8c8b5a757" ON "preparation_screen_product" ("product_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "preparation_screens" DROP COLUMN "displayOrder"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preparation_screens" DROP COLUMN "color"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP COLUMN "preparationScreenId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preparation_screen_product" ADD CONSTRAINT "FK_2dd678a88d38616bcfd93d51b3d" FOREIGN KEY ("preparation_screen_id") REFERENCES "preparation_screens"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "preparation_screen_product" ADD CONSTRAINT "FK_ef1a21aeb4617b2db8c8b5a757a" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preparation_screen_product" DROP CONSTRAINT "FK_ef1a21aeb4617b2db8c8b5a757a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preparation_screen_product" DROP CONSTRAINT "FK_2dd678a88d38616bcfd93d51b3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "preparationScreenId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "preparation_screens" ADD "color" character varying(7)`,
    );
    await queryRunner.query(
      `ALTER TABLE "preparation_screens" ADD "displayOrder" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ef1a21aeb4617b2db8c8b5a757"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2dd678a88d38616bcfd93d51b3"`,
    );
    await queryRunner.query(`DROP TABLE "preparation_screen_product"`);
  }
}
