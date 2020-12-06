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

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({nullable: true,})
  witnessChatInviteLink: string

  @Column({nullable: true,})
  witnessChatId: number;

  @Column({nullable: true,})
  tenChatInviteLink: string

  @Column({nullable: true,})
  tenChatId: number

  @Column({default: 1})
  rank: number

  @Column({enum: LocaleEnum, default: LocaleEnum.ru})
  locale: string

  @TreeParent()
  foreman: User

  @TreeChildren()
  subordinates: User[]

  @ManyToOne(() => User, foreman => foreman.foremanRequests)
  foremanRequest: User

  @OneToMany(() => User, request => request.foremanRequest)
  foremanRequests: User[]

  @Column({enum: RoleEnum, name: 'role', default: RoleEnum.Stranger})
  role: RoleEnum

  @Column({})
  firstName: string

  @Column({})
  lastName: string

  @Column({})
  href: string

  @Column({})
  patronymic: string

  @Column()
  photo: string

  @Column()
  passport: string

  @Index()
  @Column({type: 'float', default: 0,})
  latitude: number

  @Index()
  @Column({type: 'float', default: 0,})
  longitude: number

  @Column({enum: StatusEnum, default: StatusEnum.New})
  status: StatusEnum

  @Column({default: false})
  isWitness: boolean

  @Column()
  birthYear: number

  @ManyToOne(() => User, witness => witness.witnessRequests,)
  witness: User

  @OneToMany(() => User, request => request.witness)
  witnessRequests: User[]

  // @OneToMany(() => OAuth, oauth => oauth.user)
  // oauths: OAuth[]

  @Index("vkId", {unique: true})
  @Column({type: 'bigint'})
  vkId: number

  constructor(id?: number) {
    this.id = id
  }
}
