import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTicketImpressionTable1745464029599
  implements MigrationInterface
{
  name = 'CreateTicketImpressionTable1745464029599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."ticket_impression_tickettype_enum" AS ENUM('KITCHEN', 'BAR', 'BILLING', 'CUSTOMER_COPY', 'GENERAL')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ticket_impression" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_id" uuid NOT NULL, "user_id" uuid NOT NULL, "ticketType" "public"."ticket_impression_tickettype_enum" NOT NULL, "impression_time" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_58ccde2bdf3edda5fda63d62965" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket_impression" ADD CONSTRAINT "FK_39045644ff19bb02fc961bb482f" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket_impression" ADD CONSTRAINT "FK_bdcc1d40a49fed2ee030cc0aac5" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ticket_impression" DROP CONSTRAINT "FK_bdcc1d40a49fed2ee030cc0aac5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket_impression" DROP CONSTRAINT "FK_39045644ff19bb02fc961bb482f"`,
    );
    await queryRunner.query(`DROP TABLE "ticket_impression"`);
    await queryRunner.query(
      `DROP TYPE "public"."ticket_impression_tickettype_enum"`,
    );
  }
}
