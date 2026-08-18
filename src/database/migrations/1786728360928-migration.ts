import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1786728360928 implements MigrationInterface {
    name = 'Migration1786728360928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."role_name_enum" AS ENUM('Super Administrador', 'Administrador', 'Usuario')`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" "public"."role_name_enum" NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('Activo', 'Inactivo')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying NOT NULL, "firstMiddleName" character varying NOT NULL, "email" character varying NOT NULL, "codePhone" character varying NOT NULL, "phone" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "status" "public"."user_status_enum" NOT NULL DEFAULT 'Activo', "roleId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."image_generations_status_enum" AS ENUM('pending', 'processing', 'completed', 'failed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."image_generations_aspectratio_enum" AS ENUM('1:1', '2:3', '3:2', '16:9', '9:16')`);
        await queryRunner.query(`CREATE TYPE "public"."image_generations_quality_enum" AS ENUM('standard', 'hd', '4k')`);
        await queryRunner.query(`CREATE TABLE "image_generations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "prompt" text NOT NULL, "revisedPrompt" text, "negativePrompt" text, "imageUrl" character varying(1000), "thumbnailUrl" character varying(1000), "status" "public"."image_generations_status_enum" NOT NULL DEFAULT 'pending', "aspectRatio" "public"."image_generations_aspectratio_enum" NOT NULL DEFAULT '2:3', "quality" "public"."image_generations_quality_enum" NOT NULL DEFAULT 'standard', "width" integer NOT NULL DEFAULT '1024', "height" integer NOT NULL DEFAULT '1024', "generationTimeMs" integer, "errorMessage" text, "parameters" jsonb, "styleId" uuid, CONSTRAINT "PK_c11aad5515cbb3e595bc7a4718d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."image_styles_category_enum" AS ENUM('art', 'photography', 'illustration', 'abstract', 'fantasy', 'sci-fi', 'cartoon', 'realistic')`);
        await queryRunner.query(`CREATE TABLE "image_styles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "description" text, "promptTemplate" text NOT NULL, "negativePrompt" text, "category" "public"."image_styles_category_enum" NOT NULL DEFAULT 'art', "previewUrl" character varying(500), "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e454b7d47f5b3fbb607a22ab113" UNIQUE ("name"), CONSTRAINT "PK_a0c3ba5f79a4823ae822293b2dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "image_generations" ADD CONSTRAINT "FK_e15e40e1daedb01c248e5368c28" FOREIGN KEY ("styleId") REFERENCES "image_styles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image_generations" DROP CONSTRAINT "FK_e15e40e1daedb01c248e5368c28"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`DROP TABLE "image_styles"`);
        await queryRunner.query(`DROP TYPE "public"."image_styles_category_enum"`);
        await queryRunner.query(`DROP TABLE "image_generations"`);
        await queryRunner.query(`DROP TYPE "public"."image_generations_quality_enum"`);
        await queryRunner.query(`DROP TYPE "public"."image_generations_aspectratio_enum"`);
        await queryRunner.query(`DROP TYPE "public"."image_generations_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TYPE "public"."role_name_enum"`);
    }

}
