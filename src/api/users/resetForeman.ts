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
import transaction from "@/transaction/transaction";
import getContext from "@/context/getContext";
import setUserForeman from "@entity/user/setUserForeman";


/**
 *
 */
export default async function (req: Request, res: Response) {
  await transaction(async () => {
    const logger = container.createLogger({name: basename(__filename),})
    const {user, em} = getContext()
    const {id} = req.body

    // remove from subordinates
    if (id) {
      if (user.subordinates.find(eachSubordinate => eachSubordinate.id == id)) {
        const subordinate = await em.findOneOrFail(User, id,)
        logger.info('remove from subordinates')
        await setUserForeman(subordinate, null )
      } else {
        throw new KError('Invalid Subordinate', 1512)
      }
    } else {
      logger.info('remove foreman')
      await setUserForeman(user, null)
    }

    res.json(response(true))
  })
}
