import {User} from "@entity/user/User.entity";
import container from "@/di/container";
import {basename} from "path";
import plain from "@entity/user/plain";
import Chat from "@entity/Chat.entity";

// doc: https://vk.com/dev/messages.removeChatUser
export default async function (chat: Chat, user: User, ): Promise<void> {
  const vk = container.vk
  const logger = container.createLogger({name: basename(__filename),})

  await vk.api.messages.removeChatUser({
    chat_id:chat.id,
    user_id: user.mid,
  })

  logger.info({
    chat,
    added: plain(user),
  }, `Исключил ${user.iof} из чата ${chat.id} ${chat.inviteLink}`)
}
