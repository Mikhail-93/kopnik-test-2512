import {Request, Response} from "express";

import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";
import plain from "@entity/user/plain";
import response from "@api/response";
import plainForCurrentUser from "@entity/user/plainForCurrentUser";
import merge from "@entity/user/merge";
import StatusEnum from "@entity/user/StatusEnum";
import RoleEnum from "@entity/user/RoleEnum";
import KError from "@/error/KError";


/**
 * opi/webhook/create -> opi/webhook/project_name/package_name/create
 */
export default async function (req: Request, res: Response) {
  const logger = container.createLogger({name: basename(__filename),}),
    body = req.body

  const foreman = await getRepository(User).findOneOrFail(req.body.id)
  if (foreman.status != StatusEnum.Confirmed || ![RoleEnum.Kopnik, RoleEnum.DanilovKopnik].includes(foreman.role)) {
    throw new KError('Invalid Foreman: has wrong status or role', 1510)
  }

  const user = context.user
  user.foremanRequest = foreman

  await getRepository(User).save(user)
  res.json(response(true))
}
