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

/**
 *
 */
async function updateForemanRequest(req: Request, res: Response) {
  await transaction(async () => {
    const logger = container.createLogger({name: basename(__filename),})
    const {user, em} = getContext()
    const {id, status} = req.body

    const requester = await em.findOneOrFail<User>(User, id, {
      relations: ['foremanRequest']
    })

    // проверяем что текущий пользователь может заверять заявку
    if (requester.foremanRequest?.id != context.user.id || requester.status != StatusEnum.Confirmed) {
      throw new KError('Invalid Subordinate Request', 1511)
    }

    requester.foremanRequest = null
    if (status) {
      if (!user.tenChatId) {
        logger.info('create ten chat')
        user.tenChatId = await container.vk.api.messages.createChat({
          user_ids: [user.vkId, requester.vkId],
          title: `10-ка ${user.firstName}`,
        })
        user.tenChatInviteLink = user.tenChatId.toString() // TODO: !!!
        await getRepository(User).save(user)
      }
      // save foremanRequest = null also
      await setUserForeman(requester, user, em)
    } else {
      // save foremanRequest = null
      await em.save(requester)
    }

    res.json(response(true))
  })
}

export default updateForemanRequest
