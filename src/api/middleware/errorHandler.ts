import {Request, Response} from 'express'
import container from "@/di/container";
import {basename} from "path";

module.exports = function errorHandler(err: Error, req: Request, res: Response, next: Function) {
  res.status(201)
    .json({
      error: {
        error_code: (err as any).code || undefined,
        error_msg: err.message,
        error_stack: err.stack,
      }
    })

  try {
    // постгрес кидает ошибку не в объекте ошибка, а в похожем по составу полей объекте непонятного класса
    container.createLogger({name: basename(__filename)}).error(err instanceof Error ? err : {err})
  } catch (error) {
  }

  next(err)
}
