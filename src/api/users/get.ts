import {Request, Response} from "express";

import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";
import plain from "@entity/user/plain";
import response from "@api/response";
import plainForCurrentUser from "@entity/user/plainForCurrentUser";


/**
 * opi/webhook/create -> opi/webhook/project_name/package_name/create
 */
export default async function (req: Request, res: Response) {
  const logger = container.createLogger({name: basename(__filename),})
  const ids = req.query.ids.length ? (req.query.ids as string).split(',') : []
  const users: User[] = ids.length ? await getRepository(User).findByIds(ids, {
    relations: ['foreman', 'subordinates']
  }) : [context.user]

  res.json(response(users.map(eachUser => plainForCurrentUser(eachUser,))))
}
