import {Request, Response} from "express";

import container from "@/di/container";
import {basename} from "path";
import {User} from "@entity/user/User.entity";
import response from "@api/response";
import KError from "@/error/KError";
import transaction from "@/transaction/transaction";
import getContext from "@/context/getContext";
import setUserForeman from "@entity/user/setUserForeman";
import kickSubordinate from "@/vk/kickSubordinate";


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
        logger.info('remove from subordinates')
        const subordinate = await em.findOneOrFail(User, id,)
        subordinate.foreman= user //чтобы метод ВК сработал
        await kickSubordinate(subordinate, user)
        await setUserForeman(subordinate, null )
      } else {
        throw new KError('Invalid Subordinate', 1512)
      }
    }
    else if (!user.foreman){
      logger.warn('Foreman is null. Reset foreman skipped.')
    }
    else {
      logger.info('reset foreman')
      await kickSubordinate(user, user)
      await setUserForeman(user, null)
    }

    res.json(response(true))
  })
}
