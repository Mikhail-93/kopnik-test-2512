import {Container, interfaces} from "inversify";
import {Connection, ConnectionOptions, createConnection, getConnection, QueryRunner} from "typeorm/index";
import TYPES from "@/di/TYPES";
import IDbProvider from "@/di/IDbProvider";
import {resolve} from "path";
import Logger, {LoggerOptions} from "bunyan";
import bunyantcp from 'bunyan-logstash-tcp'
import _ from 'lodash'
import httpContext from 'express-cls-hooked'
import {Logger as TypeORMLogger} from "typeorm"
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import constants, {IConstants} from "@/di/constants";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";

class CustomContainer extends Container {
  get constants(): IConstants {
    return this.get<IConstants>(TYPES.constants)
  }

  createLogger(options: any = {}): Logger {
    return this.get<(options) => Logger>(TYPES.createLogger)(options)
  }

  get db(): Connection {
    return container.get<Connection>(TYPES.db)
  }

  get dbProvider(): IDbProvider {
    return this.get<IDbProvider>(TYPES.dbProvider)
  }
}

const container = new CustomContainer();

// constants
container.bind<IConstants>(TYPES.constants).toDynamicValue(context => {
  return constants[process.env.NODE_ENV]
}).inSingletonScope()

// TypeORM
container.bind<IDbProvider>(TYPES.dbProvider).toProvider<Connection>(context => {
  return async () => {
    if (context.container.isBound(TYPES.db)) {
      return context.container.get<Connection>(TYPES.db);
    }

    const ormConfig = {
      ...(context.container as CustomContainer).constants,
      namingStrategy: new class extends SnakeNamingStrategy {
        columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
          switch (propertyName){
            case 'id_ancestor':
              return 'ancestor'
            case 'id_descendant':
              return 'descendant'
            default:
              return super.columnName(propertyName, customName, embeddedPrefixes);
          }
        }
      }(),
      type: "postgres",
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: Number.parseInt(process.env.DB_PORT),
      entities: [
        "src/entity/**/*.ts",
      ],
      logger: "simple-console"
    } as PostgresConnectionOptions

    const result = await createConnection(ormConfig as ConnectionOptions)
    context.container.bind<Connection>(TYPES.db).toConstantValue(result)
    return result
  }
})

export default container;
