import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  ManyToOne,
  TreeParent,
  TreeChildren,
  OneToMany,
  Generated, PrimaryColumn, CreateDateColumn, UpdateDateColumn
} from "typeorm";
import RoleEnum from "@entity/user/RoleEnum";
import StatusEnum from "@entity/user/StatusEnum";
// import {OAuth} from "@entity/user/OAuth";
import LocaleEnum from "@entity/LocaleEnum";

// import {EntityWithSequence, NextVal} from "typeorm-sequence";

@Entity('users')
@Tree("materialized-path")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
  /**
   *  Ссылка-приглашение на чат с заверителем
   *  @deprecated надо всмпонить почему депрекедет... потому что вроде как используется...
   */
  @Column({nullable: true,})
  assuranceChatInviteLink: string

  @Column({nullable: true,})
  assuranceChatId: number;
  /**
   * Чат десятки, если юзер когда-либо становился "Старшиной"
   */
  @Column({nullable: true,})
  tenChatInviteLink: string

  @Column({nullable: true,})
  tenChatId: number

  @Column({default: 1})
  rank: number

  @Column({enum: LocaleEnum, default: LocaleEnum.ru})
  locale: string

  @TreeParent()
    // @ManyToOne(() => User, foreman => foreman.subordinates, {})
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
  patronymic: string

  @Column()
  photo: string

  @Column()
  passport: string

  @Column({type: 'decimal', precision: 14, scale: 11})
  latitude: number
  @Column({type: 'decimal', precision: 14, scale: 11})
  longitude: number

  @Column({enum: StatusEnum})
  status: StatusEnum

  @Column({default: false})
  isWitness: boolean

  @Column({})
  birthYear: number

  @ManyToOne(() => User, witness => witness.witnessRequests,)
  witness: User
  @OneToMany(() => User, request => request.witness)
  witnessRequests: User[]

  // @OneToMany(() => OAuth, oauth => oauth.user)
  // oauths: OAuth[]

  @Column()
  identifier: number
}
