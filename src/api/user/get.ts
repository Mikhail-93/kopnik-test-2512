import {Request, Response} from "express"
import container from "@/di/config";
import KError from "@/error/KError";

export default async function (req: Request, res: Response, next: Function) {
  throw new KError("Not Authorized", 1403)
}
