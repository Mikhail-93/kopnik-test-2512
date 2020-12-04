import {Request, Response} from "express";

export default async function error(req: Request, res: Response, ) {
  throw new Error('test error')
}
