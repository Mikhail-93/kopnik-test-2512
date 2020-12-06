import {Request, Response} from "express";

import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";
import response from "@api/response";
import merge from "@entity/user/merge";
import StatusEnum from "@entity/user/StatusEnum";


/**
 * opi/webhook/create -> opi/webhook/project_name/package_name/create
 */
export default async function (req: Request, res: Response) {
  const logger = container.createLogger({name: basename(__filename),}),
    body= req.body

  const user= context.user
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
    witness_id: 1,
  })

  await getRepository(User).save(user)
  res.json(response({
    witness_id: user.witness.id,
  }))
}
