import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1787875659216 implements MigrationInterface {
    name = 'Migration1787875659216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."text_generations_role_enum" AS ENUM('system', 'user', 'assistant')`);
        await queryRunner.query(`CREATE TYPE "public"."text_generations_status_enum" AS ENUM('pending', 'processing', 'completed', 'failed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "text_generations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "conversationId" character varying(255), "prompt" text NOT NULL, "response" text, "systemPrompt" text, "model" character varying(100) NOT NULL DEFAULT 'gpt-4o', "role" "public"."text_generations_role_enum" NOT NULL DEFAULT 'user', "status" "public"."text_generations_status_enum" NOT NULL DEFAULT 'pending', "temperature" double precision DEFAULT '0.7', "maxTokens" integer, "promptTokens" integer, "completionTokens" integer, "totalTokens" integer, "generationTimeMs" integer, "errorMessage" text, "parameters" jsonb, "userId" uuid, CONSTRAINT "PK_0c6f7322e4bb4b80f2ef17e1066" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "text_generations" ADD CONSTRAINT "FK_5dd7d76bd8fcc7c50c5c2bd934b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "text_generations" DROP CONSTRAINT "FK_5dd7d76bd8fcc7c50c5c2bd934b"`);
        await queryRunner.query(`DROP TABLE "text_generations"`);
        await queryRunner.query(`DROP TYPE "public"."text_generations_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."text_generations_role_enum"`);
    }

}
