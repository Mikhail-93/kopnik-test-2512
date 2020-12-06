import {Request, Response} from "express";
import md5 from 'md5'
import {Base64} from 'js-base64';

import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {User} from "@entity/user/User.entity";
import {getManager, getRepository} from "typeorm";


/**
 * @param token
 */
export default async function (token) {
  const logger = container.createLogger({name: basename(__filename),})

  const em = context.em || getManager()
  /**
   * Если токен получен от ВК, то session.mid===vk.id
   * Если токен получен от сервера приложений, у него session.mid===kopnik.id
   */
  const user = await em.findOne(User, {
    where: {
      [token.secret === "kopnik.org token" ? 'id' : 'vkId']: token.mid
    },
    relations: ['foreman', 'subordinates','foremanRequest', 'witness']
  })

  return user
}
