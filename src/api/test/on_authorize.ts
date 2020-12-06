import md5 from 'md5'
import {Request,  Response} from "express";
import response from "@api/response";

export default async function (req: Request, res: Response,) {
  res.json('OK')
}
