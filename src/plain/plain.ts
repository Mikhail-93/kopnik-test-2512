import {User} from "@entity/user/User.entity";

export default function (user: User, options: { isCurrentUser?: boolean, isForeman?: boolean, isSubordinate?: boolean, isWitness?: boolean, isSubordinateRequest?: boolean }={}) {
  const result = {
    id: user.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    patronymic: user.patronymic,
    photo: user.photo,
    location: {lat: user.latitude, lng: user.longitude},
    birthYear: user.birthyear,
    subordinates: user.subordinates?.map(eachSubordinate => eachSubordinate.id),

    passport: user.passport,
    witness: user.witness,
    foremanRequest: user.foremanRequest?.id,
    subordinateRequests: user.subordinateRequests?.map(eachSubordinateRequest => eachSubordinateRequest.id),
  }
  // passport
  if (!options.isCurrentUser && !options.isWitness) {
    delete result.passport
  }
  // witness
  if (!options.isCurrentUser && !options.isWitness) {
    delete result.witness
  }
  // foremanRequest
  if (!options.isCurrentUser && !options.isSubordinateRequest) {
    delete result.foremanRequest
  }
  // subordinateRequests
  if (!options.isCurrentUser) {
    delete result.subordinateRequests
  }
  return result
}
