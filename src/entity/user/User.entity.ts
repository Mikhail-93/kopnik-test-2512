import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  ManyToOne,
  TreeParent,
  TreeChildren,
  OneToMany,
  Generated, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index
} from "typeorm";
import RoleEnum from "@entity/user/RoleEnum";
import StatusEnum from "@entity/user/StatusEnum";
// import {OAuth} from "@entity/user/OAuth";
import LocaleEnum from "@entity/LocaleEnum";

// import {EntityWithSequence, NextVal} from "typeorm-sequence";

@Entity('users')
@Tree("closure-table")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("vkId", {unique: true})
  @Column({type: 'bigint'})
  vkId: number

  // @ManyToOne(() => User, foreman => foreman.subordinates, {eager: true})
  @TreeParent()
  foreman: User

  @TreeChildren()
  subordinates: User[]

  @Column({default: 1})
  rank: number

  @ManyToOne(() => User, foreman => foreman.foremanRequests, /*{eager: true}*/)
  foremanRequest: User

  @OneToMany(() => User, request => request.foremanRequest)
  foremanRequests: User[]

  @ManyToOne(() => User, witness => witness.witnessRequests, /*{eager: true}*/)
  witness: User

  @OneToMany(() => User, request => request.witness)
  witnessRequests: User[]

  @Column({enum: StatusEnum, default: StatusEnum.New})
  status: StatusEnum

  @Column({enum: RoleEnum, name: 'role', default: RoleEnum.Stranger})
  role: RoleEnum

  @Column({})
  firstName: string

  @Column({})
  lastName: string

  @Column({})
  patronymic: string

  @Column({enum: LocaleEnum, default: LocaleEnum.ru})
  locale: string

  @Column({})
  href: string

  @Column()
  photo: string

  @Column()
  birthYear: number

  @Column()
  passport: string

  @Index()
  @Column({type: 'float', default: 0,})
  latitude: number

  @Index()
  @Column({type: 'float', default: 0,})
  longitude: number

  @Column({default: false})
  isWitness: boolean

  @Column({nullable: true,})
  witnessChatInviteLink: string

  @Column({nullable: true,})
  witnessChatId: number;

  @Column({nullable: true,})
  tenChatInviteLink: string

  @Column({nullable: true,})
  tenChatId: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  constructor(id?: number) {
    this.id = id
  }
}
