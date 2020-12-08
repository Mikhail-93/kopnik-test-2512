import {MessagesSendParams} from "vk-io/lib/api/schemas/params";
import _send from "@/vk/utils/send";
import Chat from "@entity/Chat.entity";

/**
 * Отправляет сообщение в групповой чат
 *
 */
// doc: https://vk.com/dev/messages.createChat
// https://vk.com/dev/messages.send
export default async function (chat: Chat, message: MessagesSendParams): Promise<void> {
  await _send(chat.id+ 2000000000, message)
}
