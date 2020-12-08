import {User} from "@entity/user/User.entity";
import {DeepPartial} from "typeorm";
import Chat from "@entity/Chat.entity";
import StatusEnum from "@entity/user/StatusEnum";

export default function (user: User, data: DeepPartial<User> & { [key: string]: any }) {
  user.id = data.id ?? user.id
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
  user.mid = data.mid ?? user.mid
  user.domain = data.domain ?? user.domain

  if (data.foreman_id) {
    user.foreman = new User(data.foreman_id)
  }

  if (data.witness_id) {
    user.witness = new User({id: data.witness_id, mid: 1234})
  }

  if (data.foremanRequest_id) {
    user.foremanRequest = new User({id: data.foremanRequest_id, mid: 1234})
  }

// chats
  if (data.witnessChat) {
    user.witnessChat = data.witnessChat as Chat
  }
  if (data.foremanRequestChat) {
    user.foremanRequestChat = data.foremanRequestChat as Chat
  }

  if (data.tenChat) {
    user.tenChat = data.tenChat as Chat
  }


}
