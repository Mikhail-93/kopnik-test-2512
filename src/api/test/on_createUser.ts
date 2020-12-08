import {Request, Response} from "express";
import response from "@api/response";
import {User} from "@entity/user/User.entity";
import {getRepository} from "typeorm";
import plain from "@entity/user/plain";
import createUser from "@entity/user/createUser";
import StatusEnum from "@entity/user/StatusEnum";
import Chat from "@entity/Chat.entity";
import userFactory from "@entity/user/userFactory";

export default async function (req: Request, res: Response,) {
  const chats= {}
  const body = req.body
  // const user= userFactory(null, body)

  // predefine chats for tests
    if (body.foremanRequest_id) {
      body.foremanRequestChat = new Chat(new Date().getTime(), 'https://foremanRequestChat')
    }
    if (body.witness_id) {
      body.witnessChat = new Chat(new Date().getTime(), 'https://witnessChat')
    }

  const user = await createUser(null, req.body)

  res.json(response(user.id))
}
