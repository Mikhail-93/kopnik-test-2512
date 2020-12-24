import {User} from "@entity/user/User.entity";
import container from "@/di/container";
import FriendStatusEnum from "@/di/vk-io/FriendStatusEnum";
import {basename} from "path";
import meet from "@/vk/meet";
import Chat from "@entity/Chat.entity";
import KError from "@/error/KError";
import friends from "@/vk/utils/friends";

/**
 * Копник делает предложение быть старшиной
 * @param halfSubordinate
 */
export default async function (halfSubordinate: User): Promise<Chat> {
  const vk = container.vk
  const logger = container.createLogger({name: basename(__filename),})
  let result: Chat

  if (!halfSubordinate.foremanRequest){
    throw new KError('Полустаршина не установлен', 1500)
  }

  // ожидаю когда можно будет создать чат и пригласить в него обоих
  await friends([halfSubordinate,halfSubordinate.foremanRequest], {wait: true}, async () => {

    // свожу в чате
    result = await meet(`Предложение быть старшиной`,
      [halfSubordinate, halfSubordinate.foremanRequest],
      {
        messages: [{message: `$t Здарова браты! Единства и благополучия всему славянскому роду!
         ${halfSubordinate.foremanRequest.firstName}, ${halfSubordinate.firstName} предлагает тебе стать его старшиной.`}],
      })
  })

  return result
}
