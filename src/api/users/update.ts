import {Request, Response} from "express";

import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";
import response from "@api/response";
import merge from "@entity/user/merge";
import StatusEnum from "@entity/user/StatusEnum";
import meetWitness from "@/vk/meetWitness";
import getContext from "@/context/getContext";
import transaction from "@/transaction/transaction";


/**
 *
 */
export default async function (req: Request, res: Response) {
  await transaction(async () => {

    const logger = container.createLogger({name: basename(__filename),}),
      body = req.body
    const user = context.user
    const {em} = getContext()

    merge(user, {
      firstName: body.firstName,
      lastName: body.lastName,
      patronymic: body.patronymic,
      locale: body.locale,
      birthYear: body.birthYear,
      passport: body.passport,
      location: body.location,
      role: body.role,
      status: StatusEnum.Pending,
    })
    user.witness = await em.findOneOrFail(User, 1)

    // собираю в чат (если чат не создался, например потому что НеДрузья, то сохранение в БД дальше не произойдет)
    const chat = await meetWitness(user)
    if (!user.witnessChat?.id) {
      user.witnessChat = chat
    }

    // сохраняю
    await em.save(user)

    res.json(response({
      witness_id: user.witness.id,
    }))
  })
}
