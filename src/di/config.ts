import {Container, interfaces} from "inversify";
import {Connection, ConnectionOptions, createConnection, getConnection, QueryRunner} from "typeorm/index";
import TYPES from "@/di/TYPES";
import IConnectionProvider from "@/di/IConnectionProvider";
import {resolve} from "path";
import Logger, {LoggerOptions} from "bunyan";
import bunyantcp from 'bunyan-logstash-tcp'
import _ from 'lodash'
import httpContext from 'express-cls-hooked'
import {Logger as TypeORMLogger} from "typeorm"

class CustomContainer extends Container {
  createLogger(options: any = {}): Logger {
    return this.get<(options) => Logger>(TYPES.createLogger)(options)
  }

  get connection(): Connection {
    return container.get<Connection>(TYPES.Connection)
  }

  get connectionProvider(): IConnectionProvider {
    return this.get<IConnectionProvider>(TYPES.ConnectionProvider)
  }
}

const container = new CustomContainer();

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

// Oracle connection
container.bind<IConnectionProvider>(TYPES.ConnectionProvider).toProvider<Connection>(context => {
  return async () => {
    if (context.container.isBound(TYPES.Connection)) {
      return context.container.get<Connection>(TYPES.Connection);
    }
    const ormConfigs = {
      development: {
        // "synchronize": true,
        "logging": true,
      },
      test: {
        // "synchronize": true,
        "logging": true,
      },
      production: {
        // "synchronize": true,
        "logging": true,
      },
    }
    const ormConfig = Object.assign(ormConfigs[process.env.NODE_ENV], {
      "type": "oracle",
      "host": process.env.DB_HOST,
      "username": process.env.DB_USERNAME,
      "password": process.env.DB_PASSWORD,
      "port": process.env.DB_PORT,
      "sid": process.env.DB_SID,
      "entities": [
        "src/entity/**/*.ts",
      ],
      "migrations": [
        "src/migration/**/*.ts"
      ],
      "subscribers": [
        "src/subscriber/**/*.ts"
      ],
      "cli": {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
      },
      logger: new class CustomTypeORMLogger implements TypeORMLogger {
        constructor(public logger: Logger) {
        }

        /*    notUndefined(...args): any[] {
              return args.filter(eachArg => eachArg !== undefined)
            }*/

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
      }(container.createLogger({name: 'TypeORM'}))
    })
    const result = await createConnection(ormConfig as ConnectionOptions)
    context.container.bind<Connection>(TYPES.Connection).toConstantValue(result)
    return result
  }
})

export default container;
