import {Request, Response} from 'express'
import container from "@/di/config";
import {basename} from "path";
import KError from "@/error/KError";

module.exports = function errorHandler(err: KError, req: Request, res: Response, next: Function) {
  res.status(201)
    .json({
      error: {
        // code: err.code || 'unknown',
        error_code: err.code,
        error_msg: err.message,
        error_trace: err.stack,
      }
    })

  try {
    container.createLogger({name: basename(__filename)}).error(err)
  } catch (error) {
  }

  // next(err)
}
