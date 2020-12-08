import {User} from "@entity/user/User.entity";
import container from "@/di/container";
import FriendStatusEnum from "@/di/vk-io/FriendStatusEnum";
import {basename} from "path";
import meet from "@/vk/meet";
import Chat from "@entity/Chat.entity";
import KError from "@/error/KError";
import {FriendsAreFriendsResponse} from "vk-io/lib/api/schemas/responses";
import {FriendsFriendStatus} from "vk-io/lib/api/schemas/objects";
import FriendsFriendStatusEx from "@/vk/utils/FriendsFriendStatusEx";

/**
 * Проверяет дружбу,
 * ожидает пока не станут друзьями
 * информирует о статусах NotFriend и !Friend
 */
export default async function (users: User[], options: { wait?: boolean }, callback: (friendStatuses?: FriendsFriendStatusEx[]) => Promise<void>): Promise<void> {
  const vk = container.vk
  const logger = container.createLogger({name: basename(__filename),})
  let iteration = 0
  let lowestFriendStatus: number
  let areFriends: FriendsFriendStatusEx[]

  do {
    // получаю текущий статус
    areFriends = await vk.api.friends.areFriends({
      user_ids: users.map(eachUser => eachUser.mid),
      need_sign: 0,
    }) as FriendsFriendStatusEx[]
    areFriends.forEach(a => a.user = users.find(u => u.mid == a.user_id))
    lowestFriendStatus = Math.min(...areFriends.map(a => a.friend_status))

    const msg = areFriends.map(a =>
      a.user.iof + ': ' + FriendStatusEnum[a.friend_status]
    ).join(', ')
    logger[lowestFriendStatus==FriendStatusEnum.Friend || options.wait ?'debug':'warn'](`iteration ${++iteration}: lowest friend status = ${FriendStatusEnum[lowestFriendStatus]} for ${msg}`)

    // проверяю что текущий статус - это друзья
    if (options.wait) {
      switch (lowestFriendStatus) {
        case FriendStatusEnum.Friend:
          break
        // В этом случае ВК не даст знать, что пришла заявка в друзья. Это как Бан, про который не сообщается
        case FriendStatusEnum.NotFriend:
          throw new KError('User status is NotFriend', 1601)
        case FriendStatusEnum.ISendRequest:
        case FriendStatusEnum.HeSendRequest:
          await new Promise(res => setTimeout(res, container.constants.messaging.waitFriendDelay))
          break;
      }
    }
  }
  while (options.wait && lowestFriendStatus !== FriendStatusEnum.Friend)

  await callback(areFriends)
}
