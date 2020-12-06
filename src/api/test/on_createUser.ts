import {Request, Response} from "express";
import response from "@api/response";
import {User} from "@entity/user/User.entity";
import {getRepository} from "typeorm";
import plain from "@entity/user/plain";
import createUser from "@entity/user/createUser";

export default async function (req: Request, res: Response,) {
  const user = await createUser(null, req.body)

  res.json(response(user.id))
}
