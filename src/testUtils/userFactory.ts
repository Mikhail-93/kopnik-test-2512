import {User} from "@entity/user/User";
import UserStatus from "@entity/user/UserStatus";
import UserRole from "@entity/user/UserRole";
import {OAuth} from "@entity/user/OAuth";

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
  result.birthYear = 2020
  result.passportCode = "0123"
  result.latitude = 30
  result.longitude = 50
  result.photo = 'photo/' + prefix
  result.status = UserStatus.Confirmed
  result.locale = 'ru'
  result.role = UserRole.Kopnik
  result.rank = 1

  //OAuth
  const oauth = new OAuth()
  oauth.identifier = uniq
  oauth.provider = 'vk.com'
  oauth.accessToken = prefix + '_' + uniq
  result.oauths = [oauth]

  // generated
  result.createdAt= new Date

  for (let fieldName in fields) {
    result[fieldName] = fields[fieldName]
  }

  return result
}
