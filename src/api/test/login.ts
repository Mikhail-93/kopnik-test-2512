import md5 from 'md5'
import {Request,  Response} from "express";
import response from "@api/response";
import {getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";

export default async function (req: Request, res: Response,) {
  // const vkId = req.query.vkId || (await getRepository(User).findOneOrFail(req.params.id)).vkId

  const session = {
    expire: new Date().getTime() + 3600000,
    mid: req.params.id,
    secret: "kopnik.org token",
    sid: 1234,
    sig: undefined,
    user:{
      id: "???",
    },
  }
  session.sig = md5(`expire=${session.expire}mid=${session.mid}secret=${session.secret}sid=${session.sid}${process.env.VK_CLIENT_SECRET}`)
  res.json(response(session))
}
