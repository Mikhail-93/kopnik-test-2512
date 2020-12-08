import TYPES from "@/di/TYPES";
import {Connection, ConnectionOptions, createConnection} from "typeorm";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import container, {CustomContainer} from "@/di/container";
import IVKProvider from "@/di/vk-io/IVKProvider";
import easyvk from 'easyvk'
import IVk from "@/di/vk-io/IVk";
import {VK, API} from 'vk-io';

container.bind<IVKProvider>(TYPES.vkProvider).toProvider<IVk>(context => {
  return async () => {
    if (context.container.isBound(TYPES.vk)) {
      return context.container.get<IVk>(TYPES.vk)
    }

    const vk = await easyvk({
      // username: process.env.VK_USERNAME,
      // password: process.env.VK_PASSWORD,
      token: process.env.VK_SVETOSLAV_TOKEN,
      // authType: easyvk.GROUP_AUTH_TYPE || 'group'
    }) as IVk

    context.container.bind<IVk>(TYPES.vk).toConstantValue(vk)
    return vk
  }
})
