/*
import {Entity, PrimaryGeneratedColumn, Column, Tree, ManyToOne, TreeParent, TreeChildren, OneToMany} from "typeorm";
import RoleEnum from "@entity/user/RoleEnum";
import StatusEnum from "@entity/user/StatusEnum";
import {User} from "@entity/user/User";

@Entity()
export class OAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.oauths)
  user: User

  @Column()
  accessToken:string

  @Column({type:"float"})
  identifier:number

  @Column()
  provider: string
}
*/
