import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateThermalPrinterTable1745381092057
  implements MigrationInterface
{
  name = 'CreateThermalPrinterTable1745381092057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."thermal_printer_connectiontype_enum" AS ENUM('NETWORK', 'USB', 'SERIAL', 'BLUETOOTH')`,
    );
    await queryRunner.query(
      `CREATE TABLE "thermal_printer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "connectionType" "public"."thermal_printer_connectiontype_enum" NOT NULL, "ipAddress" character varying, "port" integer, "path" character varying, "isActive" boolean NOT NULL DEFAULT true, "macAddress" character varying(17), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_fa2e4d506b3ae2a00b5c62d894c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cd20a8ea69e128597672d5c781" ON "thermal_printer" ("ipAddress") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7f20d400228dc58a946e3b4ecb" ON "thermal_printer" ("macAddress") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7f20d400228dc58a946e3b4ecb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cd20a8ea69e128597672d5c781"`,
    );
    await queryRunner.query(`DROP TABLE "thermal_printer"`);
    await queryRunner.query(
      `DROP TYPE "public"."thermal_printer_connectiontype_enum"`,
    );
  }
}
