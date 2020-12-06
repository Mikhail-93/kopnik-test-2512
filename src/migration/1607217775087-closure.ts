import {MigrationInterface, QueryRunner} from "typeorm";

export class closure1607217775087 implements MigrationInterface {
    name = 'closure1607217775087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, CONSTRAINT "PK_9e02475ec07793f0da415c62460" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2c512dbe6cd1c71b46ce87a961" ON "users_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_9f0feb6cabcc063f06c29f5dd8" ON "users_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "mpath"`);
        await queryRunner.query(`ALTER TABLE "users_closure" ADD CONSTRAINT "FK_2c512dbe6cd1c71b46ce87a961a" FOREIGN KEY ("id_ancestor") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_closure" ADD CONSTRAINT "FK_9f0feb6cabcc063f06c29f5dd89" FOREIGN KEY ("id_descendant") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_closure" DROP CONSTRAINT "FK_9f0feb6cabcc063f06c29f5dd89"`);
        await queryRunner.query(`ALTER TABLE "users_closure" DROP CONSTRAINT "FK_2c512dbe6cd1c71b46ce87a961a"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "mpath" character varying DEFAULT ''`);
        await queryRunner.query(`DROP INDEX "IDX_9f0feb6cabcc063f06c29f5dd8"`);
        await queryRunner.query(`DROP INDEX "IDX_2c512dbe6cd1c71b46ce87a961"`);
        await queryRunner.query(`DROP TABLE "users_closure"`);
    }

}
