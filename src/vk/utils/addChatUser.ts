import {User} from "@entity/user/User.entity";
import container from "@/di/container";
import {basename} from "path";
import plain from "@entity/user/plain";
import Chat from "@entity/Chat.entity";

// doc: https://vk.com/dev/messages.addChatUser
export default async function (chat: Chat, user: User, options:{visibleMessagesCount?: number}={}): Promise<void> {
  const vk = container.vk
  const logger = container.createLogger({name: basename(__filename),})

  await vk.api.messages.addChatUser({
    chat_id:chat.id,
    user_id: user.mid,
    visible_messages_count: options.visibleMessagesCount || 0,
  })

  logger.info({
    chat,
    added: plain(user),
  }, `Пригласил ${user.iof} в чат ${chat.id} ${chat.inviteLink}`)
}
