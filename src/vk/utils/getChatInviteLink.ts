import {User} from "@entity/user/User.entity";
import container from "@/di/container";
import {basename} from "path";
import plain from "@entity/user/plain";
import {MessagesSendParams} from "vk-io/lib/api/schemas/params";
import _ from 'lodash'

// doc: https://vk.com/dev/messages.createChat
export default async function (chatId: number) :Promise<string> {
  const vk = container.vk
  const logger = container.createLogger({name: basename(__filename),})

  const {link} = await container.vk.api.messages.getInviteLink({
    peer_id: 2000000000 + chatId,
  })

  return link
}
