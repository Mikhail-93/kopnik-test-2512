import container from "@/di/container";
import {basename} from "path";
import {MessagesSendParams} from "vk-io/lib/api/schemas/params";
import _ from 'lodash'

/**
 * Отправляет сообщение в чат
 *
 */
// doc: https://vk.com/dev/messages.createChat
// https://vk.com/dev/messages.send
export default async function (chatId: number, message: MessagesSendParams): Promise<void> {
  const vk = container.vk
  const logger = container.createLogger({name: basename(__filename),})

  await vk.api.messages.send({
    peer_id: chatId,
    random_id: _.random(1000000),
    ...message
  })
}
