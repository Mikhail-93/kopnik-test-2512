import {MigrationInterface, QueryRunner} from "typeorm";

export class bigint1607124741851 implements MigrationInterface {
    name = 'bigint1607124741851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "vk_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "vk_id" bigint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "vk_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "vk_id" integer NOT NULL`);
    }

}
