import {Request, Response} from "express";
import md5 from 'md5'
import {Base64} from 'js-base64';

import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {User} from "@entity/user/User.entity";
import {getRepository} from "typeorm";

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
  const session = JSON.parse(Base64.decode(req.header('authorization')))
  const sig = md5(`expire=${session.expire}mid=${session.mid}secret=${session.secret}sid=${session.sid}${process.env.VK_CLIENT_SECRET}`)
  if (sig !== session.sig) {
    throw new Error('Hacker')
  }

  const repository = getRepository(User)
  let user = await repository.findOne({
    // если сессионные данные получены от ВК, то session.mid===vk.id
    // если сессионные данные получены от сервера приложений, то у них session.mid===kopnik.id
    where: {
      [session.secret === "kopnik.org token" ? 'id' : 'vkId']: session.mid
    },
    relations: ['subordinates', 'foremanRequests']
  })

  if (!user) {
    user = repository.create({
      firstName: session.user.first_name || '',
      lastName: session.user.last_name || '',
      patronymic: '',
      photo: 'TODO: import from VK', //TODO: import from VK
      passport: '',
      latitude: 0,
      longitude: 0,
      birthYear: 19, // TODO: import from VK
      href: session.user.href,
      vkId: session.user.id,
    })
    await repository.save<User>(user)
  }

  context.set('user', user)

  logger.debug({
    user,
  }, `${user.id} : ${user.vkId} ${user.firstName} ${user.patronymic} ${user.lastName}`)

  next()
}
