import md5 from 'md5'
import {Request,  Response} from "express";
import response from "@api/response";

export default async function (req: Request, res: Response,) {
  const session = {
    expire: new Date().getTime() + 3600000,
    mid: req.params['id'],
    secret: 1234,
    sid: 1234,
    sig: undefined
  }
  session.sig = md5(`expire=${session.expire}mid=${session.mid}secret=${session.secret}sid=${session.sid}${process.env.VK_CLIENT_SECRET}`)
  res.json(response(session))
}
