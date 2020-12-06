import {MigrationInterface, QueryRunner} from "typeorm";

export class inviteLink1607214865103 implements MigrationInterface {
    name = 'inviteLink1607214865103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "assurance_chat_invite_link"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "assurance_chat_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "witness_chat_invite_link" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "witness_chat_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "witness_chat_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "witness_chat_invite_link"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "assurance_chat_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "assurance_chat_invite_link" character varying`);
    }

}
