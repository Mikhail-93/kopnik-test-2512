import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1607449839380 implements MigrationInterface {
    name = 'migration1607449839380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "foreman_request_chat_invite_link" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "foreman_request_chat_id" bigint`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "ten_chat_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "ten_chat_id" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "ten_chat_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "ten_chat_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "foreman_request_chat_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "foreman_request_chat_invite_link"`);
    }

}
