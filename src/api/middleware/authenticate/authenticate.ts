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

/**
 * Аутентифицирует пользователя на основе его сессионных данных
 * Если сессионные данные получены от ВК, то session.mid===vk.id
 * Если сессионные данные получены от сервера приложений, то у них session.mid===kopnik.id
 */
export default async function (req: Request, res: Response, next: Function) {
  const logger = container.createLogger({name: basename(__filename),})
  const em = context.em || getManager()

  const authentication = req.header('authorization')
  if (!authentication) {
    next()
    return
  }

  const token = JSON.parse(Base64.decode(req.header('authorization'))) as IToken
  context.set('token', token)
  if (token.sig !== sig(token)) {
    throw new Error('Wrong token signature')
  }
  if (token.expire * 1000 < new Date().getTime()) {
    throw new Error('Token expired')
  }

  let user = await em.findOne(User, {
    where: {
      mid: token.mid
    },
    relations: ['foreman', 'subordinates', 'foremanRequest', 'witness']
  })

  if (user) {
    context.set('user', user)
    logger.debug(`${user.mid} -> ${user.id} : ${user.firstName} ${user.patronymic} ${user.lastName}`)
  }
  next()
}
