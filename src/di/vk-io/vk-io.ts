import TYPES from "@/di/TYPES";
import container, {CustomContainer} from "@/di/container";
import {VK} from 'vk-io';
import MK from "@/di/vk-io/MK";

container.bind<VK>(TYPES.vkIo).toDynamicValue(context => {
  const constructor= process.env.NODE_ENV=='test'?MK:VK

  // https://negezor.github.io/vk-io/ru/guide/api.html
  const vk = new constructor({
    token: process.env.VK_SVETOSLAV_TOKEN,
    apiMode: "parallel_selected", // не работает
    apiRequestMode: 'sequential',
    apiLimit: 1,
    apiExecuteCount: 25,
    apiExecuteMethods: ['messages.send'],
  })
  return vk as VK
}).inSingletonScope()
