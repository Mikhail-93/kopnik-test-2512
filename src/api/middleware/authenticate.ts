import {Request, Response} from "express";
import md5 from 'md5'
import {Base64} from 'js-base64';

import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {User} from "@entity/user/User.entity";
import {getManager, getRepository} from "typeorm";
import getUserByToken from "@entity/user/getUserByToken";

/**
 * Аутентифицирует пользователя на основе его сессионных данных
 * Если сессионные данные получены от ВК, то session.mid===vk.id
 * Если сессионные данные получены от сервера приложений, то у них session.mid===kopnik.id
 */
export default async function (req: Request, res: Response, next: Function) {
  const logger = container.createLogger({name: basename(__filename),})

  const authentication = req.header('authorization')
  if (!authentication) {
    next()
    return
  }
  const token = JSON.parse(Base64.decode(req.header('authorization')))
  const sig = md5(`expire=${token.expire}mid=${token.mid}secret=${token.secret}sid=${token.sid}${process.env.VK_CLIENT_SECRET}`)
  if (sig !== token.sig) {
    throw new Error('Wrong token signature')
  }
  if (token.expire < new Date) {
    throw new Error('Token expired')
  }

  let user = await getUserByToken(token)

  if (!user) {
    logger.info({token}, `create new user`)
    const em = getManager()
    user = em.create(User, {
      firstName: token.user.first_name || '',
      lastName: token.user.last_name || '',
      patronymic: '',
      photo: 'TODO: import from VK', //TODO: import from VK
      passport: '',
      latitude: 0,
      longitude: 0,
      birthYear: 19, // TODO: import from VK
      href: token.user.href,
      vkId: token.user.id,
    })
    await em.save(user)
  }

  context.set('user', user)

  logger.debug(`${user.vkId} -> ${user.id} : ${user.firstName} ${user.patronymic} ${user.lastName}`)

  next()
}
