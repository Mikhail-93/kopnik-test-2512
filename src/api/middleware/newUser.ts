import {Request, Response} from "express";
import {Base64} from 'js-base64';

import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {User} from "@entity/user/User.entity";
import {getManager,} from "typeorm";
import parse from 'date-fns/parse'
import IToken from "@api/middleware/authenticate/IToken";
import sig from "@api/middleware/authenticate/sig";
import getContext from "@/context/getContext";

/**
 * Новый пользователь
 */
export default async function (req: Request, res: Response, next: Function) {
  const logger = container.createLogger({name: basename(__filename),})
  const em = context.em || getManager()
  let {token, user} = getContext()

  if (token && !user) {
    logger.info({token}, `create new user`)
    const [vkUser] = await container.vk.api.users.get({
      user_ids: token.mid.toString(),
      fields: ['photo_200', 'bdate', 'domain']
    })
    const em = getManager()
    // let bdate= parse('d.M.yyyy', vkUser.bdate, new Date())
    user = em.create(User, {
      firstName: vkUser.first_name || '',
      lastName: vkUser.last_name || '',
      patronymic: vkUser.nickname || '',
      photo: vkUser.photo_200 || '',
      passport: '',
      latitude: 0,
      longitude: 0,
      birthYear: 19, //bdate?.getFullYear() || 19,
      domain: vkUser.domain,
      mid: vkUser.id,
    })
    await em.save(user)
    if (user.id == 1) {
      user.isWitness = true
      await em.save(user)
    }
    context.set('user', user)
    logger.debug(`${user.mid} -> ${user.id} : ${user.firstName} ${user.patronymic} ${user.lastName}`)
  }
  next()
}
