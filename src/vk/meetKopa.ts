import {User} from "@entity/user/User.entity";
import container from "@/di/container";
import {basename} from "path";
import meet from "@/vk/meet";
import Chat from "@entity/Chat.entity";
import friends from "@/vk/utils/friends";

export default async function (subject: string, participants: User[],): Promise<Chat> {
  const vk = container.vk
  const logger = container.createLogger({name: basename(__filename),})
  let result: Chat

  await friends(participants, {wait: false}, async () => {

    // свожу в чате
    result = await meet(`Копа: ` + subject, participants, {
      messages: [
        {message: `$t Здравия браты! Единства и благополучия всему славянскому роду!`},
        {message: `$t Вас созвал на копу наш брат ${participants[0].iof}`},
        {message: `$t Тема обсуждения: ${subject}`},
        {message: `$t Выберите меж собой кашевого только единогласным решением и передайте ему право вести эту копу.`},
        {message: `$t Во всё время проведения копы ставьте интересы рода выше своего эга, а кто не устоит, того кашевой с копы да прогонит.`},
        {message: `$t Описание порядка копы........`},
      ]
    })
  })

  return result
}
