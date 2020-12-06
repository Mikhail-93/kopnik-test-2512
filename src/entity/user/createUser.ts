import merge from "@entity/user/merge";
import {getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";
import userFactory from "@entity/user/userFactory";


export default async function (prefix?: string, data?: Partial<User> & { [key: string]: any }) {
  const user = userFactory(prefix, data)

  await getRepository(User).save(user)
  return user

}
