import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomerAndAddressTables1745468566694
  implements MigrationInterface
{
  name = 'CreateCustomerAndAddressTables1745468566694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerId" uuid NOT NULL, "street" character varying(200) NOT NULL, "number" character varying(50), "interiorNumber" character varying(50), "neighborhood" character varying(150) NOT NULL, "city" character varying(100) NOT NULL, "state" character varying(100) NOT NULL, "zipCode" character varying(10) NOT NULL, "country" character varying(100) NOT NULL, "references" text, "isDefault" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_49bc1e3cd91c06dc434318abd9" ON "address" ("zipCode") `,
    );
    await queryRunner.query(
      `CREATE TABLE "customer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "phoneNumber" character varying(20), "email" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2af7646e11a0872eb9a0212545" ON "customer" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2b5187e7475dcc88f25bec3967" ON "customer" ("lastName") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ced6878522c0e1d369f51b0ad1" ON "customer" ("email") WHERE email IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_dc34d382b493ade1f70e834c4d3" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "FK_dc34d382b493ade1f70e834c4d3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ced6878522c0e1d369f51b0ad1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2b5187e7475dcc88f25bec3967"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2af7646e11a0872eb9a0212545"`,
    );
    await queryRunner.query(`DROP TABLE "customer"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_49bc1e3cd91c06dc434318abd9"`,
    );
    await queryRunner.query(`DROP TABLE "address"`);
  }
}
