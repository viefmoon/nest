import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateModifierGroupsAndProductMoodifiers1740710716341
  implements MigrationInterface
{
  name = 'CreateModifierGroupsAndProductMoodifiers1740710716341';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_modifier" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "group_id" uuid NOT NULL, "name" character varying NOT NULL, "description" character varying, "price" numeric(10,2), "sort_order" integer NOT NULL DEFAULT '0', "is_default" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_cc4550313748a41f5e5af826e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "modifier_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "minSelections" integer NOT NULL DEFAULT '0', "maxSelections" integer NOT NULL, "isRequired" boolean NOT NULL DEFAULT false, "allowMultipleSelections" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_bda4dae1e8b5e69941a9c26b363" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_modifier_group" ("product_id" uuid NOT NULL, "modifier_group_id" uuid NOT NULL, CONSTRAINT "PK_37bc0163dbdbccfc385cf524d57" PRIMARY KEY ("product_id", "modifier_group_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e35ee74f60bf7607fcfa5b5a44" ON "product_modifier_group" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5b42ef2ec32ad54c8df5de8833" ON "product_modifier_group" ("modifier_group_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_modifier" ADD CONSTRAINT "FK_43f5c1bdd188d4c6c3c55a3af06" FOREIGN KEY ("group_id") REFERENCES "modifier_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_modifier_group" ADD CONSTRAINT "FK_e35ee74f60bf7607fcfa5b5a44e" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_modifier_group" ADD CONSTRAINT "FK_5b42ef2ec32ad54c8df5de88337" FOREIGN KEY ("modifier_group_id") REFERENCES "modifier_group"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_modifier_group" DROP CONSTRAINT "FK_5b42ef2ec32ad54c8df5de88337"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_modifier_group" DROP CONSTRAINT "FK_e35ee74f60bf7607fcfa5b5a44e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_modifier" DROP CONSTRAINT "FK_43f5c1bdd188d4c6c3c55a3af06"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5b42ef2ec32ad54c8df5de8833"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e35ee74f60bf7607fcfa5b5a44"`,
    );
    await queryRunner.query(`DROP TABLE "product_modifier_group"`);
    await queryRunner.query(`DROP TABLE "modifier_group"`);
    await queryRunner.query(`DROP TABLE "product_modifier"`);
  }
}
