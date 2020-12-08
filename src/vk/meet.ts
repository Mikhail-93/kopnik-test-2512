import {User} from "@entity/user/User.entity";
import container from "@/di/container";
import {basename} from "path";
import {MessagesSendParams} from "vk-io/lib/api/schemas/params";
import createChat from "@/vk/utils/createChat";
import Chat from "@entity/Chat.entity";
import sendToGroupChat from "@/vk/utils/sendToGroupChat";
import konaz from "@entity/user/konaz";

/**
 * Приглашает пользователей и Святослава в чат и пишет вводные сообщения
 * Если чата нет, создает его и возвращает в качестве результата своего выполения
 *
 */
export default async function (title: string, users: User[], options: { messages?: MessagesSendParams[], chat?: Chat } = {}): Promise<Chat> {
  const vk = container.vk
  const logger = container.createLogger({name: basename(__filename),})

  // создаю чат
  let result: Chat
  if (!options.chat?.id) {
    result = await createChat(title,
      [...users, konaz()],
    )
  }

  // вводные сообщения
  for (let eachMessage of options.messages || []) {
    await sendToGroupChat(result || options.chat, eachMessage)
  }

  return result
}
