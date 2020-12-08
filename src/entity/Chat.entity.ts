import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  ManyToOne,
  TreeParent,
  TreeChildren,
  OneToMany,
  Generated, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index, DeepPartial
} from "typeorm";
import RoleEnum from "@entity/user/RoleEnum";
import StatusEnum from "@entity/user/StatusEnum";
// import {OAuth} from "@entity/user/OAuth";
import LocaleEnum from "@entity/LocaleEnum";
import merge from "@entity/user/merge";

// import {EntityWithSequence, NextVal} from "typeorm-sequence";

export default class Chat {
  @Column({nullable: true,})
  inviteLink: string

  @Column({type: 'bigint', nullable: true,})
  id: number;

  constructor(id?: number, inviteLink?: string) {
    this.id = id
    this.inviteLink = inviteLink
  }
}
