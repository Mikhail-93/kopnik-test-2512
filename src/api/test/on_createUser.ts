import {Request, Response} from "express";
import response from "@api/response";
import {User} from "@entity/user/User.entity";
import {getManager, getRepository} from "typeorm";
import plain from "@entity/user/plain";
import createUser from "@entity/user/test-utils/createTestUser";
import StatusEnum from "@entity/user/StatusEnum";
import Chat from "@entity/Chat.entity";
import userFactory from "@entity/user/test-utils/testUserFactory";

export default async function (req: Request, res: Response,) {
  const chats= {}
  const body = req.body

  const user = await createUser(null, req.body)


  res.json(response(user.id))
}
