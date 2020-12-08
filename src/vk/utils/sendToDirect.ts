import {MessagesSendParams} from "vk-io/lib/api/schemas/params";
import _send from "@/vk/utils/send";
import Chat from "@entity/Chat.entity";
import {User} from "@entity/user/User.entity";

/**
 * Отправляет сообщение в групповой чат
 *
 */
// doc: https://vk.com/dev/messages.createChat
// https://vk.com/dev/messages.send
export default async function (user: User, message: MessagesSendParams): Promise<void> {
  await _send(user.mid, message)
}
