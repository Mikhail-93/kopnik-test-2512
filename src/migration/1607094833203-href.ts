import {MigrationInterface, QueryRunner} from "typeorm";

export class href1607094833203 implements MigrationInterface {
    name = 'href1607094833203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "identifier"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "href" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "vk_id" integer NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."status" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."status" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "vk_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "href"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "identifier" integer NOT NULL`);
    }

}
