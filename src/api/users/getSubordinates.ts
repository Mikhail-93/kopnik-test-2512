import {Request, Response} from "express";

import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";
import plain from "@entity/user/plain";
import response from "@api/response";
import plainForCurrentUser from "@entity/user/plainForCurrentUser";
import StatusEnum from "@entity/user/StatusEnum";


/**
 */
export default async function (req: Request, res: Response) {
  const logger = container.createLogger({name: basename(__filename),}),
    {id} = req.body

  const result = await getRepository(User).find({
    where: {
      foreman: id ? new User(id) : context.user,
      status: StatusEnum.Confirmed,
    },
    relations: ['foreman', 'subordinates']
  })

  res.json(response(result.map(eachUser => plainForCurrentUser(eachUser,))))
}
