import {User} from "@entity/user/User.entity";
import LocaleEnum from "@entity/LocaleEnum";
import {getRepository} from "typeorm";

export default function (user: User, data: Partial<User> & { [key: string]: any }) {
  const repository= getRepository(User)

  user.lastName = data.lastName
  user.firstName = data.firstName
  user.patronymic = data.patronymic
  user.birthyear = data.birthyear
  user.passport = data.passport
  user.latitude = data.location.lat
  user.longitude = data.location.lng
  user.photo = data.photo
  user.status = data.status
  user.locale = LocaleEnum[data.locale]
  user.role = data.role
  user.rank = data.rank
  user.vkId = data.identifier
  user.href= data.href || 'createUser'

  if (data.foreman_id){
    user.foreman= repository.create({id:data.foreman_id})
  }
  if (data.witness_id){
    user.witness= repository.create({id:data.witness_id})
  }
  if (data.foremanRequest_id){
    user.foremanRequest= repository.create({id:data.foremanRequest_id})
  }
}
