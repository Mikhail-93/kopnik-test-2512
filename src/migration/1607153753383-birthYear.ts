import {MigrationInterface, QueryRunner} from "typeorm";

export class birthYear1607153753383 implements MigrationInterface {
    name = 'birthYear1607153753383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "birthyear" TO "birth_year"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "birth_year" TO "birthyear"`);
    }

}
