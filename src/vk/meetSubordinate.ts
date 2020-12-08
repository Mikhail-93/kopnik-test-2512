import {User} from "@entity/user/User.entity";
import container from "@/di/container";
import {basename} from "path";
import friends from "@/vk/utils/friends";
import addChatUser from "@/vk/utils/addChatUser";
import sendToGroupChat from "@/vk/utils/sendToGroupChat";

/**
 * Встреча с новоявленным младшим десятки
 */
export default async function (subordinate: User): Promise<void> {
  const logger = container.createLogger({name: basename(__filename),})
  const foreman= subordinate.foreman

  // ожидаю когда можно будет пригласить заверяемого
  await friends([subordinate], {wait: true}, async () => {

    // свожу со старшиной
    await addChatUser(foreman.tenChat, subordinate)

    // объясняю что к чему
    await sendToGroupChat(foreman.tenChat, {message: `$t Поприветствуем нашего нового друга! Его зовут ${subordinate.firstName}`})
    await sendToGroupChat(foreman.tenChat, {message: `$t ${subordinate.firstName}, добро пожаловать! Это чат десятки. Старшина десятки ${subordinate.foreman.firstName}`})
  })
}
