import merge from "@entity/user/merge";
import {getManager, getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";
import userFactory from "@entity/user/userFactory";
import context from "@/context/context";


export default async function (prefix?: string, data?: Partial<User> & { [key: string]: any }) {
  const user = userFactory(prefix, data),
    em = context.em || getManager()

  await em.save(user)
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
