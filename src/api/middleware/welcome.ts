import {Request, Response} from "express";

import container from "@/di/container";
import {basename} from "path";
import context from "@/context/context";

let req_id = 0
/**
 * opi/webhook/create -> opi/webhook/project_name/package_name/create
 */
export default async function (req: Request, res: Response, next: Function) {
  const logger = container.createLogger({name: basename(__filename),})

  req_id++
  context.set('req_id', req_id)

  logger.debug({
    req,
    body: req.body,
  }, req.url)

  next()
}
