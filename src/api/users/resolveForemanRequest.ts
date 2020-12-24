import {Request, Response} from "express";
import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {getRepository, } from "typeorm";
import {User} from "@entity/user/User.entity";
import response from "@api/response";
import StatusEnum from "@entity/user/StatusEnum";
import KError from "@/error/KError";
import setUserForeman from "@entity/user/setUserForeman";
import getContext from "@/context/getContext";
import transaction from "@/transaction/transaction";
import meetForeman from "@/vk/meetForeman";
import meetSubordinate from "@/vk/meetSubordinate";
import informHalfSubordinateHalfForman from "@/vk/informHalfSubordinateHalfForman";

/**
 *
 */
async function resolveForemanRequest(req: Request, res: Response) {
  await transaction(async () => {
    const logger = container.createLogger({name: basename(__filename),})
    const {user, em} = getContext()
    const {id, status} = req.body

    const halfSubordinate = await em.findOneOrFail<User>(User, id, {
      relations: ['foremanRequest']
    })

    // проверяем что текущий пользователь может заверять заявку
    if (halfSubordinate.foremanRequest?.id != context.user.id || halfSubordinate.status != StatusEnum.Confirmed) {
      throw new KError('Invalid Subordinate Request', 1511)
    }

    /**
     * порядок вызовов очень важен.
     * Не присваивать halfSubordinate.foreman в обход setUserForeman(). это сломает ее
      */
    if (status) {
      if (!user.tenChat?.id) {
        const tenChat= await meetForeman(user)
        user.tenChat= tenChat
        await em.save(user) // save tenChat
      }

      await setUserForeman(halfSubordinate, user, em) // also saves foremanRequestChat = foremanRequest = null
      await meetSubordinate(halfSubordinate)
    }

    // это после приглашения в чат, чтобы в списке чатов ВК был сверху (по логическому порядку прочтения)
    await informHalfSubordinateHalfForman(halfSubordinate, status)

    halfSubordinate.foremanRequest = null
    halfSubordinate.foremanRequestChat.id= null
    halfSubordinate.foremanRequestChat.inviteLink= null
    await em.save(halfSubordinate)

    res.json(response(true))
  })
}

export default resolveForemanRequest
