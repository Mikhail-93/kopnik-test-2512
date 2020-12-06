import {Request, Response} from "express";

import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";
import plain from "@entity/user/plain";
import response from "@api/response";
import plainForCurrentUser from "@entity/user/plainForCurrentUser";
import getContext from "@/context/getContext";


/**
 * opi/webhook/create -> opi/webhook/project_name/package_name/create
 */
export default async function (req: Request, res: Response) {
  const logger = container.createLogger({name: basename(__filename),})
  const {user} = getContext()
  const ids = req.query.ids.length ? (req.query.ids as string).split(',') : []

  let users = ids.length ? await getRepository(User).findByIds(ids, {
    relations: ['foreman', 'subordinates', ]
  }) : [context.user]

  users= users.map(eachUser=>eachUser.id===user.id?user:eachUser)

  res.json(response(users.map(eachUser => plainForCurrentUser(eachUser,))))
}
