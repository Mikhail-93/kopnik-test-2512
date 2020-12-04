import {User} from "@entity/user/User.entity";
import StatusEnum from "@entity/user/StatusEnum";
import RoleEnum from "@entity/user/RoleEnum";
// import {OAuth} from "@entity/user/OAuth";

let TEST_ID = -1

export default function userFactory(prefix?: string, fields: Partial<User> = {},) {
  const result = new User()
  const now = new Date()

  if (prefix === undefined) {
    prefix = now.toLocaleTimeString()
  }
  const uniq = now.getTime()

  result.id = TEST_ID--
  result.lastName = prefix
  result.firstName = prefix
  result.patronymic = prefix
  result.birthyear = 2020
  result.passport = "0123"
  result.latitude = 30
  result.longitude = 50
  result.photo = 'photo/' + prefix
  result.status = StatusEnum.Confirmed
  result.locale = 'ru'
  result.role = RoleEnum.Kopnik
  result.rank = 1

  //OAuth
  // const oauth = new OAuth()
  result.vkId = uniq
  // oauth.provider = 'vk.com'
  // oauth.accessToken = prefix + '_' + uniq
  // result.oauths = [oauth]

  // generated
  result.createdAt= new Date

  for (let fieldName in fields) {
    result[fieldName] = fields[fieldName]
  }

  return result
}
