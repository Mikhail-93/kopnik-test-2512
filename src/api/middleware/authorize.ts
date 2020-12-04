import {Request, Response} from "express";
import md5 from 'md5'
import {Base64} from 'js-base64';

import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";
import {User} from "@entity/user/User.entity";
import {getRepository} from "typeorm";
import StatusEnum from "@entity/user/StatusEnum";
import RoleEnum from "@entity/user/RoleEnum";
import KError from "@/error/KError";

/**
 * Проверяет полномочия пользователя
 */

export default function (options: { statuses?: StatusEnum[], roles?: RoleEnum[] }) {
  return function (req, res, next) {
    const logger = container.createLogger({name: basename(__filename),})

    const user = context.user
    if (!user) {
      throw new KError('Unauthorized', 1401)
    }
    if (options.statuses && !options.statuses.includes(user.status)) {
      throw new KError(`Forbidden for status ${StatusEnum[user.status]}. Allowed for ${options.statuses.map(eachStatus=>StatusEnum[eachStatus])}`, 1403)
    }
    if (options.roles && !options.roles.includes(user.role)) {
      throw new KError(`Forbidden for role ${RoleEnum[user.role]}. Allowed for ${options.roles.map(eachRole=>RoleEnum[eachRole])}`, 1403)
    }
    next()
  }
}
