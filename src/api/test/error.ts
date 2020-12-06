import {Request, Response} from "express";
import KError from "@/error/KError";

export default async function error(req: Request, res: Response, ) {
  throw new KError('test error', 1500)
}
