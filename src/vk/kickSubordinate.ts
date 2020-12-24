import {User} from "@entity/user/User.entity";
import container from "@/di/container";
import {basename} from "path";
import removeChatUser from "@/vk/utils/removeChatUser";
import sendToGroupChat from "@/vk/utils/sendToGroupChat";
import sendToDirect from "@/vk/utils/sendToDirect";
import KError from "@/error/KError";

/**
 * Исключаю подчиненного из чата десятки
 */
export default async function (subordinate: User, kicker: User): Promise<void> {
  if (!subordinate.foreman){
    throw new KError('Foreman undefined' ,1500)
  }

  if (kicker===subordinate) {
    await sendToGroupChat(subordinate.foreman.tenChat, {
      message: `Здравия всей доброй десятке! ${subordinate.firstName} принял решение выйти из десятки. Исключаю его из вашего чата.`
    })
  }
  else{
    await sendToGroupChat(subordinate.foreman.tenChat, {
      message: `Здравия всей доброй десятке! ${subordinate.foreman.firstName} исключил ${subordinate.firstName} из десятки. Исключаю его из вашего чата.`
    })
    await sendToDirect(subordinate, {
      message:   `Приветствую ${subordinate.firstName}! Сообщаю тебе, что старшина исключил тебя из десятки. Я исключаю тебя из её чата. Не отчаивайся, это не всегда плохо. Если тебя исключили из десятки, найди другую, с которой тебе будет по пути.`
    })
  }

  await removeChatUser(subordinate.foreman.tenChat, subordinate)
}
