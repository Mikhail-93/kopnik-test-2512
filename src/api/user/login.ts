import {Request, Response} from "express"
import md5 from 'md5'
import container from "@/di/config";

export default async function (req: Request, res: Response, next: Function) {
  const session= req.body.session
  const sig= md5(`expire=${session.expire}mid=${session.mid}secret=${session.secret}sid=${session.sid}${process.env.VK_CLIENT_SECRET}`)
  if (sig!== session.sig){
    throw new Error('Hacker')
  }
  res.json({
    response:{
      OK:'OK'
    }
  })
}
