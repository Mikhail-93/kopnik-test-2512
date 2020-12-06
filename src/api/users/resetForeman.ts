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
import KError from "@/error/KError";


/**
 *
 */
export default async function (req: Request, res: Response) {
  const logger = container.createLogger({name: basename(__filename),}),
    {id} = req.body

  const user = context.user

  if (id) {
    const subordinate = await getRepository(User).findOneOrFail(id)
    if (user.subordinates.find(eachSubordinate => eachSubordinate.id == subordinate.id)) {
      logger.info('remove subordinate from subordinates')
      subordinate.foreman = null
      await getRepository(User).save(subordinate)
    } else {
      throw new KError('Invalid Subordinate', 1512)
    }
  } else {
    logger.info('remove foreman')
    user.foreman = null
    await getRepository(User).save(user)
  }

  res.json(response(true))
}
