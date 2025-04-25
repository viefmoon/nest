import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1745554714683 implements MigrationInterface {
  name = 'CreateInitialTables1745554714683';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "area" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_644ffaf8fbde4db798cb47712fe" UNIQUE ("name"), CONSTRAINT "PK_39d5e4de490139d6535d75f42ff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "table" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "areaId" uuid NOT NULL, "capacity" integer, "isActive" boolean NOT NULL DEFAULT true, "isAvailable" boolean NOT NULL DEFAULT true, "isTemporary" boolean NOT NULL DEFAULT false, "temporaryIdentifier" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_28914b55c485fc2d7a101b1b2a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "status" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'other', 'prefer_not_to_say')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "username" character varying NOT NULL, "password" character varying, "firstName" character varying, "lastName" character varying, "birthDate" date, "gender" "public"."user_gender_enum", "phoneNumber" character varying, "address" character varying, "city" character varying, "state" character varying, "country" character varying, "zipCode" character varying, "emergencyContact" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "photoId" uuid, "roleId" integer, "statusId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "REL_75e2be4ce11d447ef43be0e374" UNIQUE ("photoId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."thermal_printer_connectiontype_enum" AS ENUM('NETWORK', 'USB', 'SERIAL', 'BLUETOOTH')`,
    );
    await queryRunner.query(
      `CREATE TABLE "thermal_printer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "connectionType" "public"."thermal_printer_connectiontype_enum" NOT NULL, "ipAddress" character varying, "port" integer, "path" character varying, "isActive" boolean NOT NULL DEFAULT true, "macAddress" character varying(17), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_cd20a8ea69e128597672d5c7813" UNIQUE ("ipAddress"), CONSTRAINT "PK_fa2e4d506b3ae2a00b5c62d894c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cd20a8ea69e128597672d5c781" ON "thermal_printer" ("ipAddress") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7f20d400228dc58a946e3b4ecb" ON "thermal_printer" ("macAddress") `,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT true, "photoId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "daily_order_counter" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "current_number" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_3727dbf94985a0b5a19fbee830a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_paymentmethod_enum" AS ENUM('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_paymentstatus_enum" AS ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderId" uuid NOT NULL, "paymentMethod" "public"."payment_paymentmethod_enum" NOT NULL DEFAULT 'CASH', "amount" numeric(10,2) NOT NULL, "paymentStatus" "public"."payment_paymentstatus_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ticket_impression_tickettype_enum" AS ENUM('KITCHEN', 'BAR', 'BILLING', 'CUSTOMER_COPY', 'GENERAL')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ticket_impression" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_id" uuid NOT NULL, "user_id" uuid NOT NULL, "ticketType" "public"."ticket_impression_tickettype_enum" NOT NULL, "impression_time" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_58ccde2bdf3edda5fda63d62965" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_orderstatus_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'READY', 'DELIVERED', 'COMPLETED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_ordertype_enum" AS ENUM('DINE_IN', 'TAKE_AWAY', 'DELIVERY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "daily_number" integer NOT NULL, "daily_order_counter_id" uuid NOT NULL, "user_id" uuid NOT NULL, "table_id" uuid, "orderStatus" "public"."orders_orderstatus_enum" NOT NULL DEFAULT 'PENDING', "orderType" "public"."orders_ordertype_enum" NOT NULL DEFAULT 'DINE_IN', "total" numeric(10,2) NOT NULL DEFAULT '0', "notes" text, "phoneNumber" character varying, "customer_name" character varying, "delivery_address" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "modifier_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "minSelections" integer NOT NULL DEFAULT '0', "maxSelections" integer NOT NULL, "isRequired" boolean NOT NULL DEFAULT false, "allowMultipleSelections" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_bda4dae1e8b5e69941a9c26b363" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_modifier" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "group_id" uuid NOT NULL, "name" character varying NOT NULL, "description" character varying, "price" numeric(10,2), "sort_order" integer NOT NULL DEFAULT '0', "is_default" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_cc4550313748a41f5e5af826e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_item_modifiers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_item_id" uuid NOT NULL, "modifier_id" uuid NOT NULL, "modifier_option_id" uuid, "quantity" integer NOT NULL, "price" numeric(10,2) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_e87d8ed07e34e0bd3cdc8f64ec8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_item_preparationstatus_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderId" character varying NOT NULL, "productId" character varying NOT NULL, "productVariantId" uuid, "quantity" integer NOT NULL, "basePrice" numeric(10,2) NOT NULL, "finalPrice" numeric(10,2) NOT NULL, "preparationStatus" "public"."order_item_preparationstatus_enum" NOT NULL DEFAULT 'PENDING', "statusChangedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "preparationNotes" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "order_id" uuid NOT NULL, "product_id" uuid NOT NULL, "product_variant_id" uuid, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_variant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "name" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_1ab69c9935c61f7c70791ae0a9f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "preparation_screens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" character varying(255), "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7ac7b3fa4460e49952d274aa1d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" numeric(10,2), "hasVariants" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "subCategoryId" uuid NOT NULL, "photoId" uuid, "estimatedPrepTime" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "preparationScreenId" uuid, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subcategory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT true, "categoryId" uuid NOT NULL, "photoId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5ad0b82340b411f9463c8e9554d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "userId" uuid, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `,
    );
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
    await queryRunner.query(
      `CREATE TABLE "customer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "phoneNumber" character varying(20), "email" character varying(255), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerId" uuid NOT NULL, "street" character varying(200) NOT NULL, "number" character varying(50), "interiorNumber" character varying(50), "neighborhood" character varying(150) NOT NULL, "city" character varying(100) NOT NULL, "state" character varying(100) NOT NULL, "zipCode" character varying(10) NOT NULL, "country" character varying(100) NOT NULL, "references" text, "isDefault" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_49bc1e3cd91c06dc434318abd9" ON "address" ("zipCode") `,
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
      `ALTER TABLE "table" ADD CONSTRAINT "FK_e641365cc7fff73367015b8c400" FOREIGN KEY ("areaId") REFERENCES "area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_e79f3fad5ac0030f01b52fcf6c6" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_d09d285fe1645cd2f0db811e293" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket_impression" ADD CONSTRAINT "FK_39045644ff19bb02fc961bb482f" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket_impression" ADD CONSTRAINT "FK_bdcc1d40a49fed2ee030cc0aac5" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_a58a2dd0047cb0a307d68127733" FOREIGN KEY ("daily_order_counter_id") REFERENCES "daily_order_counter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_3d36410e89a795172fa6e0dd968" FOREIGN KEY ("table_id") REFERENCES "table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_modifier" ADD CONSTRAINT "FK_43f5c1bdd188d4c6c3c55a3af06" FOREIGN KEY ("group_id") REFERENCES "modifier_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item_modifiers" ADD CONSTRAINT "FK_1f6709a805b8bcafe0bda11edbf" FOREIGN KEY ("order_item_id") REFERENCES "order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item_modifiers" ADD CONSTRAINT "FK_e8ec685225f6710f5ce06a8ffff" FOREIGN KEY ("modifier_id") REFERENCES "product_modifier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_e9674a6053adbaa1057848cddfa" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_5e17c017aa3f5164cb2da5b1c6b" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_19fe8036263238b4fb3866243bf" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD CONSTRAINT "FK_6e420052844edf3a5506d863ce6" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_2910df1471f6bf34df891d72e17" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_463d24f6d4905c488bd509164e6" FOREIGN KEY ("subCategoryId") REFERENCES "subcategory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_c3d9d0f7b1a7312a1926307b4bf" FOREIGN KEY ("preparationScreenId") REFERENCES "preparation_screens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subcategory" ADD CONSTRAINT "FK_cddec05034d6fd592da49a6441b" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subcategory" ADD CONSTRAINT "FK_3fc84b9483bdd736f728dbf95b2" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_dc34d382b493ade1f70e834c4d3" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE "address" DROP CONSTRAINT "FK_dc34d382b493ade1f70e834c4d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subcategory" DROP CONSTRAINT "FK_3fc84b9483bdd736f728dbf95b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subcategory" DROP CONSTRAINT "FK_cddec05034d6fd592da49a6441b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_c3d9d0f7b1a7312a1926307b4bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_463d24f6d4905c488bd509164e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_2910df1471f6bf34df891d72e17"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP CONSTRAINT "FK_6e420052844edf3a5506d863ce6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_19fe8036263238b4fb3866243bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_5e17c017aa3f5164cb2da5b1c6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_e9674a6053adbaa1057848cddfa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item_modifiers" DROP CONSTRAINT "FK_e8ec685225f6710f5ce06a8ffff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item_modifiers" DROP CONSTRAINT "FK_1f6709a805b8bcafe0bda11edbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_modifier" DROP CONSTRAINT "FK_43f5c1bdd188d4c6c3c55a3af06"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_3d36410e89a795172fa6e0dd968"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_a58a2dd0047cb0a307d68127733"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket_impression" DROP CONSTRAINT "FK_bdcc1d40a49fed2ee030cc0aac5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket_impression" DROP CONSTRAINT "FK_39045644ff19bb02fc961bb482f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_d09d285fe1645cd2f0db811e293"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_e79f3fad5ac0030f01b52fcf6c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "table" DROP CONSTRAINT "FK_e641365cc7fff73367015b8c400"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5b42ef2ec32ad54c8df5de8833"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e35ee74f60bf7607fcfa5b5a44"`,
    );
    await queryRunner.query(`DROP TABLE "product_modifier_group"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_49bc1e3cd91c06dc434318abd9"`,
    );
    await queryRunner.query(`DROP TABLE "address"`);
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
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "subcategory"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "preparation_screens"`);
    await queryRunner.query(`DROP TABLE "product_variant"`);
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(
      `DROP TYPE "public"."order_item_preparationstatus_enum"`,
    );
    await queryRunner.query(`DROP TABLE "order_item_modifiers"`);
    await queryRunner.query(`DROP TABLE "product_modifier"`);
    await queryRunner.query(`DROP TABLE "modifier_group"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_ordertype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_orderstatus_enum"`);
    await queryRunner.query(`DROP TABLE "ticket_impression"`);
    await queryRunner.query(
      `DROP TYPE "public"."ticket_impression_tickettype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TYPE "public"."payment_paymentstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."payment_paymentmethod_enum"`);
    await queryRunner.query(`DROP TABLE "daily_order_counter"`);
    await queryRunner.query(`DROP TABLE "category"`);
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
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "status"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "table"`);
    await queryRunner.query(`DROP TABLE "area"`);
  }
}
