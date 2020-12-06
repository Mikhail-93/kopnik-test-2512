import {get, set} from 'express-cls-hooked'
import {User} from "@entity/user/User.entity";
import {EntityManager, getManager} from "typeorm";
import context from "@/context/context";
import getUserByToken from "@entity/user/getUserByToken";

export default function () {
  return {
    user: context.user,
    em: context.em,
    req_id: context.req_id,
  }
}
