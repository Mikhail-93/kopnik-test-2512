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

  const requester = await getRepository(User).findOneOrFail(id, {
    relations: ['witness']
  })

  // проверяем что статус один из допустимых
  if (![StatusEnum.Confirmed, StatusEnum.Declined].includes(status)) {
    throw new KError('Incorrect status', 1000)
  }

  // проверяем что текущий пользователь может заверять заявку
  if (requester.witness?.id != context.user.id || requester.status != StatusEnum.Pending) {
    throw new KError('Pending user not found', 1005)
  }

  requester.status = status
  await getRepository(User).save(requester)

  res.json(response(true))
}
