import {MigrationInterface, QueryRunner} from "typeorm";

export class location1607208056371 implements MigrationInterface {
    name = 'location1607208056371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_c35cee5cd356d46618a4c6e830"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "latitude" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP INDEX "IDX_86bdc2660bdb0a455ebc911b24"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "longitude" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE INDEX "IDX_c35cee5cd356d46618a4c6e830" ON "users" ("latitude") `);
        await queryRunner.query(`CREATE INDEX "IDX_86bdc2660bdb0a455ebc911b24" ON "users" ("longitude") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_86bdc2660bdb0a455ebc911b24"`);
        await queryRunner.query(`DROP INDEX "IDX_c35cee5cd356d46618a4c6e830"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "longitude" numeric(14,11) NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_86bdc2660bdb0a455ebc911b24" ON "users" ("longitude") `);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "latitude" numeric(14,11) NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_c35cee5cd356d46618a4c6e830" ON "users" ("latitude") `);
    }

}
