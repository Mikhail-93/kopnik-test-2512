import {MigrationInterface, QueryRunner} from "typeorm";

export class birthyear1607114094362 implements MigrationInterface {
    name = 'birthyear1607114094362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "birth_year" TO "birthyear"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "birthyear" TO "birth_year"`);
    }

}
