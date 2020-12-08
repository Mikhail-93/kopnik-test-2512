import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1607365068654 implements MigrationInterface {
    name = 'migration1607365068654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "mid" bigint NOT NULL, "rank" integer NOT NULL DEFAULT '1', "status" integer NOT NULL DEFAULT '0', "role" integer NOT NULL DEFAULT '5', "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "patronymic" character varying NOT NULL, "locale" character varying NOT NULL DEFAULT 'ru', "domain" character varying NOT NULL, "photo" character varying NOT NULL, "birth_year" integer NOT NULL, "passport" character varying NOT NULL, "latitude" double precision NOT NULL DEFAULT '0', "longitude" double precision NOT NULL DEFAULT '0', "is_witness" boolean NOT NULL DEFAULT false, "witness_chat_invite_link" character varying, "witness_chat_id" integer, "ten_chat_invite_link" character varying, "ten_chat_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "foreman_id" integer, "foreman_request_id" integer, "witness_id" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "mid" ON "users" ("mid") `);
        await queryRunner.query(`CREATE INDEX "IDX_c35cee5cd356d46618a4c6e830" ON "users" ("latitude") `);
        await queryRunner.query(`CREATE INDEX "IDX_86bdc2660bdb0a455ebc911b24" ON "users" ("longitude") `);
        await queryRunner.query(`CREATE TABLE "users_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, CONSTRAINT "PK_9e02475ec07793f0da415c62460" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2c512dbe6cd1c71b46ce87a961" ON "users_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_9f0feb6cabcc063f06c29f5dd8" ON "users_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_3f2ef8d57199d7c09f1c8f6badb" FOREIGN KEY ("foreman_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_02d5d8759e7b2c846207fa5d32b" FOREIGN KEY ("foreman_request_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_d125919cc7488019263ef5bc92d" FOREIGN KEY ("witness_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_closure" ADD CONSTRAINT "FK_2c512dbe6cd1c71b46ce87a961a" FOREIGN KEY ("id_ancestor") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_closure" ADD CONSTRAINT "FK_9f0feb6cabcc063f06c29f5dd89" FOREIGN KEY ("id_descendant") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_closure" DROP CONSTRAINT "FK_9f0feb6cabcc063f06c29f5dd89"`);
        await queryRunner.query(`ALTER TABLE "users_closure" DROP CONSTRAINT "FK_2c512dbe6cd1c71b46ce87a961a"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_d125919cc7488019263ef5bc92d"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_02d5d8759e7b2c846207fa5d32b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_3f2ef8d57199d7c09f1c8f6badb"`);
        await queryRunner.query(`DROP INDEX "IDX_9f0feb6cabcc063f06c29f5dd8"`);
        await queryRunner.query(`DROP INDEX "IDX_2c512dbe6cd1c71b46ce87a961"`);
        await queryRunner.query(`DROP TABLE "users_closure"`);
        await queryRunner.query(`DROP INDEX "IDX_86bdc2660bdb0a455ebc911b24"`);
        await queryRunner.query(`DROP INDEX "IDX_c35cee5cd356d46618a4c6e830"`);
        await queryRunner.query(`DROP INDEX "mid"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
