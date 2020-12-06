import {MigrationInterface, QueryRunner} from "typeorm";

export class indexes1607159416672 implements MigrationInterface {
    name = 'indexes1607159416672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_c35cee5cd356d46618a4c6e830" ON "users" ("latitude") `);
        await queryRunner.query(`CREATE INDEX "IDX_86bdc2660bdb0a455ebc911b24" ON "users" ("longitude") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "vkId" ON "users" ("vk_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "vkId"`);
        await queryRunner.query(`DROP INDEX "IDX_86bdc2660bdb0a455ebc911b24"`);
        await queryRunner.query(`DROP INDEX "IDX_c35cee5cd356d46618a4c6e830"`);
    }

}
