import {User} from "@entity/user/User.entity";
import sendToGroupChat from "@/vk/utils/sendToGroupChat";

/**
 * Сообщаю подавшему заявку о решении старшины (принять его или нет)
 */
export default async function (halfSubordinate: User): Promise<void> {
  await sendToGroupChat(halfSubordinate.foremanRequestChat, {
    message: `$t ${halfSubordinate.firstName} отменил свое предложение. Можем расходиться.`
  })
}
