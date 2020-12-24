import {Request, Response} from "express";

import container from "@/di/container";
import {basename} from "path";
import {User} from "@entity/user/User.entity";
import response from "@api/response";
import StatusEnum from "@entity/user/StatusEnum";
import RoleEnum from "@entity/user/RoleEnum";
import KError from "@/error/KError";
import transaction from "@/transaction/transaction";
import getContext from "@/context/getContext";
import setUserForeman from "@entity/user/setUserForeman";
import informHalfForemanBad from "@/vk/informHalfForemanBad";
import meetHalfForeman from "@/vk/meetHalfSubordinateHalfForeman";
import kickSubordinate from "@/vk/kickSubordinate";


/**
 *
 */
export default async function (req: Request, res: Response) {
  await transaction(async () => {
    const logger = container.createLogger({name: basename(__filename),})
    const {user, em} = getContext()
    const {id} = req.body

    const halfForeman = id ? await em.findOneOrFail(User, id) : null

    // tree-cycle
    if (halfForeman) {
      const halfForemanForemans= await em.getTreeRepository(User).findAncestors(halfForeman)
      if (halfForemanForemans.find(f=>f.id==user.id)){
        throw new KError('Foreman cycle', 1)
      }
    }

    // reset foreman
    if (user.foreman && id) {
      logger.info('reset foreman before new foreman request')
      await kickSubordinate(user, user)
      await setUserForeman(user, null)
    }

    // reset foreman request
    if (user.foremanRequest) {
      await informHalfForemanBad(user)
    }

    if (id) {
      if (halfForeman.status != StatusEnum.Confirmed || ![RoleEnum.Kopnik, RoleEnum.DanilovKopnik].includes(halfForeman.role)) {
        throw new KError('Invalid Foreman: has wrong status or role', 1510)
      }
      user.foremanRequest = halfForeman

      // свожу в чате полу-младшего и полу-старшего
      user.foremanRequestChat = await meetHalfForeman(user)
    } else {
      user.foremanRequest = null
    }

    await em.save(user)
    res.json(response(true))
  })
}
