import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderHistoryTables1745466844899
  implements MigrationInterface
{
  name = 'CreateOrderHistoryTables1745466844899';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order_item_history" ("id" SERIAL NOT NULL, "order_item_id" uuid NOT NULL, "order_id" uuid NOT NULL, "operation" character varying(10) NOT NULL, "changed_by" uuid NOT NULL, "changed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "diff" jsonb, "snapshot" jsonb NOT NULL, CONSTRAINT "PK_a8f0e093d17d8b23a2e66f6b514" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_db2b69c88d576d94d850a29662" ON "order_item_history" ("order_id", "changed_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_76d4e87926d94c8805a3621219" ON "order_item_history" ("order_item_id", "changed_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "order_history" ("id" SERIAL NOT NULL, "order_id" uuid NOT NULL, "operation" character varying(10) NOT NULL, "changed_by" uuid NOT NULL, "changed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "diff" jsonb, "snapshot" jsonb NOT NULL, CONSTRAINT "PK_cc71513680d03ecb01b96655b0c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a2937c330238ea84f26c912104" ON "order_history" ("order_id", "changed_at") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a2937c330238ea84f26c912104"`,
    );
    await queryRunner.query(`DROP TABLE "order_history"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_76d4e87926d94c8805a3621219"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_db2b69c88d576d94d850a29662"`,
    );
    await queryRunner.query(`DROP TABLE "order_item_history"`);
  }
}
