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

// Bunyan
container.bind<interfaces.Factory<Logger>>(TYPES.createLogger).toFactory((context) => {
  return (options = {}) => {
    const defaultOptions: LoggerOptions = {
      name: "main",
      streams: [
        /*      заменил на консоль лог
                {
                  level: "debug",
                  stream: process.stdout            // log INFO and above to stdout
                },*/
        {
          type: "rotating-file",
          path: resolve(__dirname, '../../logs', process.env.NODE_ENV + ".log"),
          period: "1d",   // daily rotation
          count: process.env.NODE_ENV == "production" ? 100 : 1,        // keep 100 back copies
          level: "debug"
        }
      ],
      serializers: Logger.stdSerializers,
      src: true
    };

    // в dev режиме сами отправляем логи в Логсташ
    if (process.env.NODE_ENV === 'development') {
      /*      (defaultOptions.streams as any).push({
              level: 'debug',
              type: "raw",
              stream: bunyantcp.createStream({
                host: 'urz.open.ru',
                // port: 9998,
                port: 9995,
              })
            })*/
    }
    const loggerOptions = _.merge(defaultOptions, options)
    return new class ContextualLogger extends Logger {
      log(level: 'debug' | 'warn' | 'info' | 'error', params: any[]) {
        // if (process.env.NODE_ENV==='test'){
        console[level](this.fields.name, ...params)
        // }
        const req_id = httpContext.get('req_id')
        try {
          if (req_id) {
            this.fields.req_id = req_id
          }
          // @ts-ignore
          return super[level](...params)
        } finally {
          delete this.fields.req_id
        }
      }

      // @ts-ignore
      debug(...params): void {
        // @ts-ignore
        return this.log('debug', params)
      }

      // @ts-ignore
      info(...params): void {
        // @ts-ignore
        return this.log('info', params)
      }

      // @ts-ignore
      warn(...params): void {
        // @ts-ignore
        return this.log('warn', params)
      }

      // @ts-ignore
      error(...params): void {
        // @ts-ignore
        return this.log('error', params)
      }
    }(loggerOptions)
  }
});

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
            // case 'id_ancestor':
              // return 'ancestor'
            // case 'id_descendant':
            //   return 'descendant'
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
      migrations: [
        "src/migration/**/*.ts"
      ],
      subscribers: [
        "src/subscriber/**/*.ts"
      ],
      cli: {
        entitiesDir: "src/entity",
        migrationsDir: "src/migration",
        subscribersDir: "src/subscriber"
      },
      logger: new class CustomTypeORMLogger implements TypeORMLogger {
        constructor(public logger: Logger) {
        }

        logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
          this.logger.debug(query, parameters || '')
        }

        logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
          this.logger.error(error, query, parameters || '')
        }

        logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        }

        logSchemaBuild(message: string, queryRunner?: QueryRunner) {
          this.logger.info(message)
        }

        logMigration(message: string, queryRunner?: QueryRunner) {
          this.logger.info(message)
        }

        log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner) {
          // TypeORM No classes were found using the provided glob pattern:  "src/subscriber/**/*.ts"
          // this.logger[level](message)
        }
      }((context.container as CustomContainer).createLogger({name: 'TypeORM'}))
    } as PostgresConnectionOptions

    const result = await createConnection(ormConfig as ConnectionOptions)
    context.container.bind<Connection>(TYPES.db).toConstantValue(result)
    return result
  }
})

export default container;
