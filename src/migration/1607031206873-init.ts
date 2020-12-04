import {MigrationInterface, QueryRunner} from "typeorm";

export class init1607031206873 implements MigrationInterface {
    name = 'init1607031206873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "assurance_chat_invite_link" character varying, "assurance_chat_id" integer, "ten_chat_invite_link" character varying, "ten_chat_id" integer, "rank" integer NOT NULL DEFAULT '1', "locale" character varying NOT NULL DEFAULT 'ru', "role" integer NOT NULL DEFAULT '5', "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "patronymic" character varying NOT NULL, "photo" character varying NOT NULL, "passport" character varying NOT NULL, "latitude" numeric(14,11) NOT NULL, "longitude" numeric(14,11) NOT NULL, "status" integer NOT NULL, "is_witness" boolean NOT NULL DEFAULT false, "birth_year" integer NOT NULL, "identifier" integer NOT NULL, "mpath" character varying DEFAULT '', "foreman_id" integer, "foreman_request_id" integer, "witness_id" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_3f2ef8d57199d7c09f1c8f6badb" FOREIGN KEY ("foreman_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_02d5d8759e7b2c846207fa5d32b" FOREIGN KEY ("foreman_request_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_d125919cc7488019263ef5bc92d" FOREIGN KEY ("witness_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_d125919cc7488019263ef5bc92d"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_02d5d8759e7b2c846207fa5d32b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_3f2ef8d57199d7c09f1c8f6badb"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
