import md5 from 'md5'
import {Request, Response} from "express";
import response from "@api/response";
import {User} from "@entity/user/User.entity";
import merge from "@/merge/merge";
import {getRepository} from "typeorm";
import plain from "@/plain/plain";

export default async function (req: Request, res: Response,) {
  const user = new User()
  merge(user, req.body)
  await getRepository(User).save(user)

  res.json(response(plain(user,)))
}
