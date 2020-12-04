import {Request, Response} from "express";

import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";
import plain from "@/plain/plain";
import response from "@api/response";


/**
 * opi/webhook/create -> opi/webhook/project_name/package_name/create
 */
export default async function (req: Request, res: Response) {
  const logger = container.createLogger({name: basename(__filename),})
  const ids = req.query.ids.length? (req.query.ids as string).split(','):[]
  const users: User[] = ids.length ? await getRepository(User).findByIds(ids, {
    relations: ['subordinates', 'subordinateRequests']
  }) : [context.user]

  res.json(response(users.map(eachUser => plain(eachUser, {
    isCurrentUser: eachUser.id == context.user?.id,
    isForeman: eachUser.id == context.user?.foreman?.id,
    isWitness: eachUser.id == context.user?.witness?.id,
    isSubordinate: (context.user?.subordinates || []).find(eachSubordinate => eachSubordinate.id == eachUser.id) as any,
    isSubordinateRequest:  (context.user?.subordinateRequests || []).find(eachSubordinateRequest => eachSubordinateRequest.id == eachUser.id) as any,
  }))))
}
