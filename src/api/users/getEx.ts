import {Request, Response} from "express";

import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";
import response from "@api/response";
import plainForCurrentUser from "@entity/user/plainForCurrentUser";
import StatusEnum from "@entity/user/StatusEnum";


/**
 * opi/webhook/create -> opi/webhook/project_name/package_name/create
 */
export default async function (req: Request, res: Response) {
  const logger = container.createLogger({name: basename(__filename),})

  const user = await getRepository(User).findOneOrFail(context.user.id, {
    relations: ['witnessRequests', 'foremanRequest', 'foreman', 'subordinates', 'foremanRequests',]
  })

  user.witnessRequests= user.witnessRequests.filter(wr=>wr.status===StatusEnum.Pending)

  res.json(response(plainForCurrentUser(user,)))
}
