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
      message: `Здравия всей доброй десятке! Для справки сообщаю, что ${subordinate.firstName} выходит из вашей десятки.`
    })
  }
  else{
    await sendToDirect(subordinate, {
      message:   `Приветствую ${subordinate.firstName}! Сообщаю тебе, что старшина исключил тебя из десятки. Это не всегда плохо. Если так случилось, значит найди другую общину, с которой тебе будет по пути.`
    })
  }

  await removeChatUser(subordinate.foreman.tenChat, subordinate)
}
