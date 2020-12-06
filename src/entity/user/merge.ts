import {User} from "@entity/user/User.entity";
import LocaleEnum from "@entity/LocaleEnum";
import {getRepository} from "typeorm";

export default function (user: User, data: Partial<User> & { [key: string]: any }) {
  const repository = getRepository(User)

  user.lastName = data.lastName ?? user.lastName
  user.firstName = data.firstName ?? user.firstName
  user.patronymic = data.patronymic ?? user.patronymic
  user.birthYear = data.birthYear ?? user.birthYear
  user.passport = data.passport ?? user.passport
  user.latitude = data.location?.lat ?? user.latitude
  user.longitude = data.location?.lng ?? user.longitude
  user.photo = data.photo ?? user.photo
  user.status = data.status ?? user.status
  user.locale = data.locale ?? user.locale
  user.isWitness = data.isWitness ?? user.isWitness
  user.role = data.role ?? user.role
  user.rank = data.rank ?? user.rank
  user.vkId = data.vkId ?? data.identifier ?? user.vkId
  user.href = data.href ?? user.href

  if (data.foreman_id) {
    user.foreman = repository.create({id: data.foreman_id})
  }
  if (data.witness_id) {
    user.witness = repository.create({id: data.witness_id})
  }
  if (data.foremanRequest_id) {
    user.foremanRequest = repository.create({id: data.foremanRequest_id})
  }
}
