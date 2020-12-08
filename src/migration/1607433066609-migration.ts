import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1607433066609 implements MigrationInterface {
    name = 'migration1607433066609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "witness_chat_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "witness_chat_id" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "witness_chat_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "witness_chat_id" integer`);
    }

}
