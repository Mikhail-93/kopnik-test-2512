import {Request, Response} from "express";
import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";
import response from "@api/response";
import StatusEnum from "@entity/user/StatusEnum";
import KError from "@/error/KError";

/**
 *
 */
export default async function (req: Request, res: Response) {
  const logger = container.createLogger({name: basename(__filename),})
  const {id, status} = req.body
  const user = context.user

  const requester = await getRepository(User).findOneOrFail(id, {
    relations: ['foremanRequest']
  })

  // проверяем что текущий пользователь может заверять заявку
  if (requester.foremanRequest?.id != context.user.id || requester.status != StatusEnum.Confirmed) {
    throw new KError('Invalid Subordinate Request', 1511)
  }

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
  }

  requester.foremanRequest = null
  requester.foreman = status ? context.user : null
  await getRepository(User).save(requester)


  res.json(response(true))
}
