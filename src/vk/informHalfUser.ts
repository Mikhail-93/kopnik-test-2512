import {User} from "@entity/user/User.entity";
import sendToGroupChat from "@/vk/utils/sendToGroupChat";
import StatusEnum from "@entity/user/StatusEnum";

export default async function (halfUser: User): Promise<void> {
  await sendToGroupChat(halfUser.witnessChat, {message: halfUser.status===StatusEnum.Confirmed?`$t Поздравляю! Заверитель подтвердил твою истинность. Теперь тебе доступны все возможности kopnik.org`: `$t Заверитель не смог подтвердить твою истинность. Без этого мы не можем принять тебя в нашу сеть.`})
}
