import {User} from "@entity/user/User.entity";
import container from "@/di/container";
import FriendStatusEnum from "@/di/vk-io/FriendStatusEnum";
import {basename} from "path";
import meet from "@/vk/meet";
import Chat from "@entity/Chat.entity";
import KError from "@/error/KError";
import friends from "@/vk/utils/friends";

export default async function (foreman: User, ): Promise<Chat> {
  const logger = container.createLogger({name: basename(__filename),})
  let result: Chat

  // ожидаю когда можно будет создать чат и пригласить в него новоявленного старшину
  await friends([foreman], {wait: true}, async () => {

    // встречаюсь со старшиной
    result = await meet(`10-ка ${foreman.firstName}`,
      [foreman, ],
      {
        chat: foreman.tenChat,
        messages: [{message: `$t ${foreman.firstName}! Настал новый этап в твоей жизни, теперь ты - старшина. Быть старшиной значит, что тебе доверяют представление своих интересов и интересов своей семьи другие копные мужи. Это временная должность, тот кто выбрал, может и снять тебя. Относись к своим новым обязанностям добросовестно!`},
          {message:`Я создал для общения в десятке это чат. Я сам буду приглашать в него всех, кто так же выберет тебя старшиной и буду исключать из него всех, кто передумает. Так тебе и твоим друзьям будет удобнее общаться только между собой в близком кругу.`},
          {message: `$t А сейчас встречай первого друга`}],
      })
  })

  return result
}
