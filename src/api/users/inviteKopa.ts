import {Request, Response} from "express";
import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {getRepository,} from "typeorm";
import {User} from "@entity/user/User.entity";
import response from "@api/response";
import StatusEnum from "@entity/user/StatusEnum";
import KError from "@/error/KError";
import setUserForeman from "@entity/user/setUserForeman";
import getContext from "@/context/getContext";
import transaction from "@/transaction/transaction";
import meetForeman from "@/vk/meetForeman";
import meetSubordinate from "@/vk/meetSubordinate";
import informHalfSubordinate from "@/vk/informHalfSubordinateHalfForman";
import RoleEnum from "@entity/user/RoleEnum";
import meetKopa from "@/vk/meetKopa";

/**
 *
 */
export default async function (req: Request, res: Response) {
  await transaction(async () => {
    const logger = container.createLogger({name: basename(__filename),})
    const {user, em} = getContext()
    const {subject, } = req.body

    const participants = await em.findByIds<User>(User, req.body.participants)

    // проверяем что текущий пользователь может звать таких копников
    for (let eachParticipant of participants) {
      if (![RoleEnum.Kopnik, RoleEnum.DanilovKopnik].includes(eachParticipant.role) || eachParticipant.status != StatusEnum.Confirmed || user.rank * 10 < eachParticipant.rank) {
        throw new KError('Invalid participants', 1520)
      }
    }
    // проверяем количество
    if (participants.length < 1 || 9 < participants.length) {
      throw new KError('Invalid participants', 1520)
    }

    // созываем копу в Мессенджере
    const kapaChat = await meetKopa(subject, [user, ...participants])

    res.json(response(true))
  })
}
