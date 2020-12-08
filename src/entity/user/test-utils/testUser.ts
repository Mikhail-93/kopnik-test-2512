import {getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";

export default function (fields={}) {
  const user = new User({
    mid: parseInt(process.env.VK_TEST_USER),
    firstName: 'Борода',
    patronymic: 'Гореевич',
    lastName: 'Удалой',
    ...fields
  })
  return user
}
