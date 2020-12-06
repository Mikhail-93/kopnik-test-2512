import {User} from "@entity/user/User.entity";
import context from "@/context/context";
import plain from "@entity/user/plain";

/**
 * обертка над plain() которая делается относительно текущего пользователя
 * @param user
 */
export default function (user: User) {
  const currentUser= context.user
  return plain(user, {
    isCurrentUser: user.id == currentUser?.id,
    isForeman: user.id == currentUser?.foreman?.id,
    isWitness: user.id == currentUser?.witness?.id,
    isSubordinate: !!currentUser?.subordinates?.find(eachSubordinate => eachSubordinate.id == user.id),
    isSubordinateRequest:  !!currentUser?.foremanRequests?.find(eachSubordinateRequest => eachSubordinateRequest.id == user.id),
  })
}
