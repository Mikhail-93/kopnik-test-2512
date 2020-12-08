import {Request, Response} from "express";
import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";
import response from "@api/response";
import StatusEnum from "@entity/user/StatusEnum";
import KError from "@/error/KError";
import informHalfUser from "@/vk/informHalfUser";
import transaction from "@/transaction/transaction";

/**
 *
 */
export default async function (req: Request, res: Response) {
  await transaction(async ()=>{
    const logger = container.createLogger({name: basename(__filename),})
    const {id, status} = req.body

    const halfUser = await getRepository(User).findOneOrFail(id, {
      relations: ['witness']
    })

    // проверяем что статус один из допустимых
    if (![StatusEnum.Confirmed, StatusEnum.Declined].includes(status)) {
      throw new KError('Incorrect status', 1000)
    }

    // проверяем что текущий пользователь может заверять заявку
    if (halfUser.witness?.id != context.user.id || halfUser.status != StatusEnum.Pending) {
      throw new KError('Pending user not found', 1005)
    }

    halfUser.status = status
    await informHalfUser(halfUser)
    await getRepository(User).save(halfUser)
  })

  res.json(response(true))
}
