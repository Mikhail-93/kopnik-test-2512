import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  ManyToOne,
  TreeParent,
  TreeChildren,
  OneToMany,
  Generated, PrimaryColumn, CreateDateColumn
} from "typeorm";
import UserRole from "@entity/user/UserRole";
import UserStatus from "@entity/user/UserStatus";
import {OAuth} from "@entity/user/OAuth";
// import {EntityWithSequence, NextVal} from "typeorm-sequence";

@Entity('users')
@Tree("closure-table")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date
  /**
   *  Ссылка-приглашение на чат с заверителем
   *  @deprecated надо всмпонить почему депрекедет... потому что вроде как используется...
   */
  @Column({nullable: true, })
  assuranceChatInviteLink: string

  @Column({nullable: true, })
  assuranceChatId: number;
  /**
   * Чат десятки, если юзер когда-либо становился "Старшиной"
   */
  @Column({nullable: true, })
  tenChatInviteLink: string

  @Column({nullable: true, })
  tenChatId: number

  @Column({nullable: false})
  rank: number

  @Column({nullable: true})
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

  @Column({enum: UserRole, name:'kopnik_role'})
  role: UserRole

  @Column({})
  firstName: string

  @Column({})
  lastName: string

  @Column({})
  patronymic : string

  @Column()
  photo : string

  @Column({})
  passportCode: string

  @Column({type:'decimal', precision:14, scale:11, nullable: true})
  latitude: number
  @Column({type:'decimal', precision:14, scale:11, nullable: true})
  longitude: number

  @Column({enum: UserStatus})
  status: UserStatus

  @Column({})
  isWitness: boolean

  @Column({})
  birthYear: number

  @ManyToOne(() => User, witness => witness.witnessRequests,)
  witness: User
  @OneToMany(() => User, request => request.witness)
  witnessRequests: User[]

  @OneToMany(() => OAuth, oauth => oauth.user)
  oauths: OAuth[]
}
