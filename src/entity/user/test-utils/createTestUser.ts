import merge from "@entity/user/merge";
import {getManager, getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";
import userFactory from "@entity/user/test-utils/testUserFactory";
import context from "@/context/context";
import Chat from "@entity/Chat.entity";


export default async function (prefix?: string, data?: Partial<User> & { [key: string]: any }) {
  const user = userFactory(prefix, data),
    em = context.em || getManager()

  await em.save(user)

  if (user.foreman){
    user.foreman.tenChat= new Chat(1234, 'https://tenChat')
    await em.save(user.foreman)
  }
  // increase ranks for new relations
  if (user.foreman) {
    await em.query(`
    update users
        set rank= rank+ ${user.rank}
    WHERE 
        id IN (SELECT id_ancestor FROM users_closure WHERE id_descendant = ${user.id})
        AND id <> ${user.id};
  `)
  }


  return user
}
