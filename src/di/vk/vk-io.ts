import TYPES from "@/di/TYPES";
import container, {CustomContainer} from "@/di/container";
import {VK} from 'vk-io';
import MK from "@/di/vk/MK";

container.bind<VK>(TYPES.vkIo).toDynamicValue(context => {
  const constructor= process.env.NODE_ENV=='test'?MK:VK

  // https://negezor.github.io/vk-io/ru/guide/api.html
  const vk = new constructor({
    token: process.env.VK_SVETOSLAV_TOKEN,
    apiMode: "sequential",
    apiRequestMode: 'sequential',
  })
  return vk
}).inSingletonScope()
