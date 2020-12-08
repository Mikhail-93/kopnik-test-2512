import {User} from "@entity/user/User.entity";
import container from "@/di/container";
import FriendStatusEnum from "@/di/vk-io/FriendStatusEnum";
import {basename} from "path";
import meet from "@/vk/meet";
import Chat from "@entity/Chat.entity";
import KError from "@/error/KError";
import friends from "@/vk/utils/friends";

export default async function (halfUser: User): Promise<Chat> {
  const vk = container.vk
  const logger = container.createLogger({name: basename(__filename),})
  let result: Chat

  if (!halfUser.witness?.mid){
    throw new KError(`Empty witness`, 1500)
  }

  // ожидаю когда можно будет создать чат и пригласить в него обоих
  await friends([halfUser, halfUser.witness], {wait: true}, async () => {

    // свожу в чате с заверителем
    result = await meet(`Регистрация в kopnik.org ${halfUser.iof}`,
      [halfUser, halfUser.witness,],
      {
        chat: halfUser.witnessChat,
        messages: [{message: `$t Здравия ${halfUser.firstName}. Я пригласил тебя и твоего заверителя в этот чат, чтобы ты мог заверить свои данные. Мы должны проверить твои данные, чтобы убедиться что сеть наполнена реальными людьми, теми за кого себя выдают и обоснование необходимсти заверения и пользы для самого пользователя от этой процедуры.... `},
          {message: `Далее описание самой процедуры ......  : Тебе назначен заверитель. Твоя обязанность предоставить доказательства заверителю, какие он потребует. Заверитель при заверении берет в расчет близость, возможность связи по телефону, скайпу...`},
          {message: 'Если ты не готов пройти процедуру заверения, выходи отсюда, не морочь нам голову..."'}],
      })
  })

  return result
}
