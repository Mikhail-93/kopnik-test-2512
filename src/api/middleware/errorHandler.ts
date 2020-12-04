import {Request, Response} from 'express'
import container from "@/di/container";
import {basename} from "path";

module.exports = function errorHandler(err: Error, req: Request, res: Response, next: Function) {
  res.status(201)
    .json({
      error: {
        // code: err.code || 'unknown',
        message: err.message,
        stack: err.stack,
      }
    })

  try {
    container.createLogger({name: basename(__filename)}).error(err)
  } catch (error) {
  }

  next(err)
}
