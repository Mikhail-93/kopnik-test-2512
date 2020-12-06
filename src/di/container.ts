import {Container, interfaces} from "inversify";
import {Connection, ConnectionOptions, createConnection, getConnection, QueryRunner} from "typeorm/index";
import TYPES from "@/di/TYPES";
import {resolve} from "path";
import Logger, {LoggerOptions} from "bunyan";
import bunyantcp from 'bunyan-logstash-tcp'
import _ from 'lodash'
import httpContext from 'express-cls-hooked'
import {Logger as TypeORMLogger} from "typeorm"
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import constants, {IConstants} from "@/di/constants";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";
import IDbProvider from "@/di/db/IDbProvider";
import IVKProvider from "@/di/vk/IVKProvider";
import {VK} from "vk-io";


export class CustomContainer extends Container {
  get constants(): IConstants {
    return this.get<IConstants>(TYPES.constants)
  }

  createLogger(options: any = {}): Logger {
    return this.get<(options) => Logger>(TYPES.createLogger)(options)
  }

  get dbOptions(): PostgresConnectionOptions {
    return container.get<PostgresConnectionOptions>(TYPES.dbOptions)
  }

  get db(): Connection {
    return container.get<Connection>(TYPES.db)
  }

  get dbProvider(): IDbProvider {
    return this.get<IDbProvider>(TYPES.dbProvider)
  }

  get provideVk(): IVKProvider {
    return this.get<IVKProvider>(TYPES.vkProvider)
  }

  get vk(): VK {
    return this.get<VK>(TYPES.vkIo)
  }
}

const container = new CustomContainer();
export default container;

// constants
container.bind<IConstants>(TYPES.constants).toDynamicValue(context => {
  return constants[process.env.NODE_ENV]
}).inSingletonScope()

// createLogger
import './createLogger/createLogger'

// db
import './db/dbOptions'
import './db/db'

// vk
import "@/di/vk/vk";
import "@/di/vk/vk-io";


