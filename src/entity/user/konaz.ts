import {getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";

export default function () {
  const user = new User({
    mid: parseInt(process.env.VK_SVETOSLAV_ID),
    firstName: 'Святослав',
    patronymic: 'Игоревич',
    lastName: 'Рюрик',
  })
  return user
}
